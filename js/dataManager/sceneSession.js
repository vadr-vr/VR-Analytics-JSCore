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
        
        const gameTime = timeManager.getPlayTimeSinceStart() - this.sceneBeginTime;
        this.currentMediaSession = new mediaSession(mediaId, name, type,
            utils.convertMillisecondsToSecondsFloat(gameTime), url);
        this.media.push(this.currentMediaSession);

    }

    /**
     * Closes an ongoing media session
     */
    closeMedia(){

        if (!(this.currentMediaSession)){

            logger.warn('Request to close non existent media session, Aborting');
            return;

        }

        // Place to register any additional events before closing the media session

        this.currentMediaSession = null;        

    }
        
    /**
     * Adds event to the events list 
     * @private
     * @param {string} eventName name of the event
     * @param {string} position 3D position associated with the event
     * @param {object} extra extra information and filter key-value pairs in the event
     */
    _registerEvent(eventName, position, extra){

        const gameTime = timeManager.getPlayTimeSinceStart() - this.sceneBeginTime;
        this.events.eventName.push(eventName);
        this.events.position.push(position);
        this.events.extra.push(extra);
        this.events.eventTime.push(timeManager.getFrameUnixTime());
        this.events.gameTime.push(utils.convertMillisecondsToSecondsFloat(gameTime));

    }

    /**
     * Adds event to event list of media if it exists, else to its own events list
     * @param {string} eventName name of the event
     * @param {string} position 3D position associated with the event
     * @param {object} extra extra information and filter key-value pairs in the event
     */
    registerEvent(eventName, position, extra){

        if (this.currentMediaSession){

            const gameTime = timeManager.getPlayTimeSinceStart() - this.sceneBeginTime;
            this.currentMediaSession.registerEvent(eventName, position, extra,
                utils.convertMillisecondsToSecondsFloat(gameTime));

        } else {

            this._registerEvent(eventName, position, extra);
            
        }

    }

    /**
     * Fetch the dictionary corresponding to this media
     * @returns {object} dictionary form of sceneSession
     */
    getDictionary(){

        const sceneSessionDictionary = {
            'sceneId': this.sceneId,
            'startTime': utils.convertMillisecondsToSeconds(this.startTime),
            'sceneToken': this.token,
            'events': this.events,
            'media': []
        };

        if (this.name)
            sceneSessionDictionary['sceneName'] = this.name;

        // fetch all the media dictionaries
        for (let i = 0; i < this.media.length; i++){

            sceneSessionDictionary['media'].push(this.media[i].getDictionary());

        }

        return sceneSessionDictionary;

    }

    /**
     * Returns a duplicate duplicate of the current scene session without any data. 
     * Assigns the last active media if present
     * @returns {SceneSession} duplicate scene session
     */
    getDuplicate(){

        const newSceneSession = new SceneSession(this.sceneId, this.name);

        // assign params not passed to the constructor
        newSceneSession.startTime = this.startTime;
        newSceneSession.sceneBeginTime = this.sceneBeginTime;
        newSceneSession.token = this.token;

        // set a duplicate media if any media active
        if (this.currentMediaSession){

            const mediaSessionDuplicate = this.currentMediaSession.getDuplicate();
            newSceneSession.currentMediaSession = mediaSessionDuplicate;
            newSceneSession.media.push(newSceneSession.currentMediaSession);

        }

        return newSceneSession;

    }
    
}

export default SceneSession;