import utils from '../utils';
import timeManager from '../timeManager';
import gazeCollector from '../dataCollector/gazeCollector';

const _getGazeAngle = (position) => {

    if (position){

        return position;

    }else{

        const angle = gazeCollector.getAngle();
        return angle ? angle : '0.0,0.0,0.0';

    }

}

/**
 * Stores events for a single media playback.
 * @param {string} mediaId Developer defined mediaId for the media
 * @param {string} name Media name to be displayed to the analytics user
 * @param {number} type Type of media 1 - Video, 2 - Photo
 * @param {number} sceneStartTime Time since start of scene when media is displayed 
 * @param {string} url Url for the media [optional]
 */
class MediaSession{
    
    constructor(mediaId, name, type, sceneStartTime, url){

        this.mediaId = mediaId;
        this.name = name;
        this.type = type;
        this.sceneStartTime = sceneStartTime;
        this.url = url;

        this.startTime = timeManager.getFrameUnixTime();
        this.mediaBeginTime = timeManager.getPlayTimeSinceStart();
        this.token = utils.getToken();
        this.events = {
            'eventName': [],
            'position': [],
            'gameTime': [],
            'eventTime': [],
            'mediaDuration': [],
            'extra': []
        };

        if (this.type == 1)
            this.events['videoDuration'] = [];

    }

    /**
     * Assign url of media after initialization 
     * @param {string} newUrl name of the property to be set
     */
    setUrl(newUrl){

        this.url = newUrl;

    }

    /**
     * Adds event to the events list 
     * @param {string} eventName name of the event
     * @param {string} position 3D position associated with the event
     * @param {object} extra extra information and filter key-value pairs in the event
     * @param {number} gameTime time since start of scene when the event occurred
     */
    registerEvent(eventName, position, extra, gameTime){

        this.events.eventName.push(eventName);
        this.events.position.push(_getGazeAngle(position));
        this.events.extra.push(extra);
        this.events.gameTime.push(gameTime);
        this.events.eventTime.push(timeManager.getFrameUnixTime());

        // calculate mediaDuration from eventPlayTimeSinceStart
        const mediaDuration = timeManager.getPlayTimeSinceStart() - 
            this.mediaBeginTime;
        this.events.mediaDuration.push(
            utils.convertMillisecondsToSecondsFloat(mediaDuration));

        // fetch the video duration of the event
        if (this.type == 1){

            this.events.videoDuration.push(timeManager.getVideoDuration());

        }

    }

    /**
     * Fetch the dictionary corresponding to this media
     * @returns {object} dictionary form of media
     */
    getDictionary(){

        const mediaDictionary = {
            'id': this.mediaId,
            'name': this.name,
            'type': this.type,
            'startTime': utils.convertMillisecondsToSeconds(this.startTime),
            'sceneStartTime': this.sceneStartTime,
            'token': this.token,
            'events': this.events
        };

        if (this.url)
            mediaDictionary['url'] = this.url;

        return mediaDictionary;

    }

    /**
     * Returns a duplicate of the current media without any data in it
     * @returns {MediaSession} duplicate media session
     */
    getDuplicate(){

        const newMediaSession = new MediaSession(this.mediaId, this.name, this.type, 
            this.sceneStartTime, this.url);

        // assign properties not passed to constructor
        newMediaSession.token = this.token;
        newMediaSession.startTime = this.startTime;
        newMediaSession.mediaBeginTime = this.mediaBeginTime;
        
        return newMediaSession;

    }
    
}

export default MediaSession;