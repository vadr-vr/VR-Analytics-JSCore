import utils from '../utils';
import timeManager from '../timeManager';

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
     * Adds event to the events list 
     * @param {string} eventName name of the event
     * @param {string} position 3D position associated with the event
     * @param {object} extra extra information and filter key-value pairs in the event
     * @param {number} gameTime time since start of scene when the event occurred
     * @param {number} eventTime unix time in milliseconds when the event occurred
     * @param {number} eventPlayTimeSinceStart time in milliseconds when the application started
     * @param {number} videoDuration seek time of the video when event occurred [optional]
     */
    registerEvent(eventName, position, extra, gameTime, eventTime, eventPlayTimeSinceStart,
        videoDuration){

        this.events.eventName.push(eventName);
        this.events.position.push(position);
        this.events.extra.push(extra);
        this.events.gameTime.push(gameTime);
        this.events.eventTime.push(eventTime);

        // calculate mediaDuration from eventPlayTimeSinceStart
        this.events.mediaDuration.push(eventPlayTimeSinceStart - this.mediaBeginTime);

        if (this.type == 1)
            this.events.videoDuration.push(videoDuration);

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
    
}

export default MediaSession;