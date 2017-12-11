import utils from '../utils';
import logger from '../logger';
import timeManager from '../timeManager';
import mediaSession from './mediaSession';

/**
 * Stores events for a single scene play.
 * @param {string} sceneId Developer defined sceneId for the scene
 * @param {string} name Media name to be displayed to the analytics user [optional]
 */
class SceneSession{
    
    constructor(sceneId, name){

        this.sceneId = sceneId;
        this.name = name;
        
        this.startTime = timeManager.getFrameUnixTime();
        this.sceneBeginTime = timeManager.getPlayTimeSinceStart();
        this.token = utils.getToken();
        
        this.currentMediaSession = null;
        this.media = [];

        this.events = {
            'eventName': [],
            'position': [],
            'gameTime': [],
            'eventTime': [],
            'extra': []
        };

    }

    /**
     * Adds media to the media list
     * @param {string} mediaId Developer defined mediaId for the media
     * @param {string} name Media name to be displayed to the analytics user
     * @param {number} type Type of media 1 - Video, 2 - Photo
     * @param {string} url Url for the media [optional]
     */
    addMedia(mediaId, name, type, url){
        
        const timeSinceSceneBegin = timeManager.getPlayTimeSinceStart() - this.sceneBeginTime;
        this.currentMediaSession = new mediaSession(mediaId, name, type, timeSinceSceneBegin, url);
        this.media.push(this.currentMediaSession);

    }

    /**
     * Closes an ongoing media session
     */
    closeMediaSession(){

        if (!(this.currentMediaSession)){

            logger.warn('Request to close non existent session, returning');
            return;

        }

        // Place to register any additional events before closing the session

        this.currentMediaSession = null;        

    }
        
    /**
     * Adds event to the events list 
     * @private
     * @param {string} eventName name of the event
     * @param {string} position 3D position associated with the event
     * @param {object} extra extra information and filter key-value pairs in the event
     * @param {number} eventTime unix time in millisseconds when the event occurred
     * @param {number} eventPlayTimeSinceStart time in milliseconds when the application started
     */
    _registerEvent(eventName, position, extra, eventTime, eventPlayTimeSinceStart){

        this.events.eventName.push(eventName);
        this.events.position.push(position);
        this.events.extra.push(extra);
        this.events.eventTime.push(eventTime);
        this.events.gameTime.push(eventPlayTimeSinceStart - this.sceneBeginTime);

    }

    /**
     * Fetch the dictionary corresponding to this media
     * @returns {object} dictionary form of media
     */
    getDictionary(){

        const sceneSessionDictionary = {
            'sceneId': this.mediaId,
            'startTime': utils.convertMillisecondsToSeconds(this.startTime),
            'sceneToken': this.token,
            'events': this.events
        };

        if (this.name)
            sceneSessionDictionary['sceneName'] = this.name;

        return sceneSessionDictionary;

    }
    
}

export default SceneSession;