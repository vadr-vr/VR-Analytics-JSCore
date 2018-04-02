import utils from '../utils';
import logger from '../logger';
import timeManager from '../timeManager';
import applicationConfig from '../config';
import userData from '../userData';
import deviceData from '../deviceData';
import sceneSession from './sceneSession';

/**
 * Stores events for a single session
 * @param {object} extras dictionary containing extra information about the session 
 * such as location, language, connection etc. User fields are fetched automatically
 */
class Session{
    
    constructor(sessionToken, startTime, extra){

        if (sessionToken)
            this.token = sessionToken;
        else
            this.token = utils.getToken();

        if (startTime)
            this.time = startTime;
        else
            this.time = timeManager.getFrameUnixTime();

        this.extra = utils.deepClone(extra);

        this.scenes = [];
        this.currentScene = null;

    }

    /**
     * Set or overwrite any extra key value pair
     * @param {string} key
     * @param {string, number} value
     */
    setExtra(key, value){

        if (key.length > 50){

            logger.error('Max length of session extra info key is 50 chars. Aborting.');
            return;

        }

        if (typeof(value) == 'string' && value.length > 255){

            logger.error('Max length of session extra info val is 255 chars. Aborting.');
            return;
            
        }

        if (typeof(value) != 'string' && typeof(value) != 'number'){

            logger.error('Session extra info val should be string or number. Aborting');
            return;

        }

        this.extra[key] = value;

    }

    /**
     * Start a new scene session 
     * @param {string} sceneId id of the new scene
     * @param {string} sceneName name of the new scene [optional]
     */
    addScene(sceneId, sceneName){

        this.currentScene = new sceneSession(sceneId, sceneName);
        this.scenes.push(this.currentScene);
    
    }

    /**
     * Closes an ongoing scene session
     */
    closeScene(){

        if (this.currentScene == null){

            logger.warn('request to close non existent scene session, Aborting');
            return;
            
        }

        // Place to register any additional events before closing the session

        this.currentScene = null;        

    }

    /**
     * Adds media to the media list
     * @param {string} mediaId Developer defined mediaId for the media
     * @param {string} name Media name to be displayed to the analytics user
     * @param {number} type Type of media 1 - Video, 2 - Photo
     * @param {string} url Url for the media [optional]
     */
    addMedia(mediaId, name, type, url){
        
        if (this.currentScene == null){
            
            logger.warn('trying to register media without registering scene. Aborting');
            return;

        }

        this.currentScene.addMedia(mediaId, name, type, url);

    }
    
    /**
     * Closes an ongoing media session
     */
    closeMedia(){
        
        if (this.currentScene == null){

            logger.warn('Request to close media session without registering scene, \
                Aborting');
            return;

        }

        this.currentScene.closeMedia();

    }

    /**
     * Adds event to event list of media if it exists, else to its own events list
     * @param {string} eventName name of the event
     * @param {string} position 3D position associated with the event
     * @param {object} extra extra information and filter key-value pairs in the event
     */
    registerEvent(eventName, position, extra){

        if (this.currentScene == null){
            
            logger.warn('trying to register event without registering scene. Aborting');
            return;

        }

        this.currentScene.registerEvent(eventName, position, extra);
                
    }

    /**
     * Returns the session token of the current session
     * @returns {string} sessionToken
     */
    getSessionToken(){

        return this.token;

    }

    /**
     * Returns the unix time of session start
     * @returns {number} session start unixTime
     */
    getSessionUnixTime(){

        return this.time;

    }

    /**
     * Get dictionary corresponding to session
     * @returns {object} dictionary form of session
     */
    getDictionary(){

        const sessionDicitonary = {
            'token': this.token,
            'time': utils.convertMillisecondsToSeconds(this.time),
            'extra': this.extra,
            'scenes': []
        };

        const browserInfo = deviceData.getBrowserInfo();

        for (let key in browserInfo){

            sessionDicitonary['extra'][key] = browserInfo[key];

        }

        if (applicationConfig.getTestMode())
            sessionDicitonary['test'] = 'true';
        else 
            sessionDicitonary['test'] = 'false';

        sessionDicitonary['extra']['user'] = userData.getUserDictionary();

        for (let i = 0; i < this.scenes.length; i++){

            sessionDicitonary['scenes'].push(this.scenes[i].getDictionary());

        }

        return sessionDicitonary;

    }

    /**
     * Gets duplicate of the current session without carrying over any data. 
     * Contains the information of the latest sceneSession and the latest media session
     * @returns {Session} new session from the original session
     */
    getDuplicate(){
        
        const newSession = new Session(this.token, this.time, this.extra);

        if (this.currentScene){

            newSession.currentScene = this.currentScene.getDuplicate();
            newSession.scenes.push(newSession.currentScene);

        }

        return newSession;

    }

}

export default Session;