import logger from '../logger';
import utils from '../utils';
import session from './session';
import config from '../config';
import timeManager from '../timeManager';
import dataCollector from '../dataCollector/dataCollector';
import serverRequestManager from './serverRequestManager';

/**
 * @module DataManager
 * @description Stores registered data, manages data requests to the server  
 */

/**
 * @memberof DataManager
 * @type {session}
 * @private
 */
let currentSession = null;
let mediaPlaying = false;
let eventDataPairs = 0;

let lastRequestTime = null;
let timeSinceRequestChecker = null;
/**
 * Init the collection of data
 * @memberof DataManager
 */
function init(){

    _createSession();

}

// Functions related to creating and deleting scene sessions and media sessions
/**
 * create scene session
 * @memberof DataManager
 * @param {string} sceneId id of the new scene
 * @param {string} sceneName name of the new scene [optional]
 */
function addScene(sceneId, sceneName){

    currentSession.addScene(sceneId, sceneName);

}

/**
 * close the ongoing scene
 * @memberof DataManager
 */
function closeScene(){

    currentSession.closeScene();
    _createDataRequest();

}

/**
 * Adds media to the media list
 * @memberof DataManager
 * @param {string} mediaId Developer defined mediaId for the media
 * @param {string} name Media name to be displayed to the analytics user
 * @param {number} type Type of media 1 - Video, 2 - Photo
 * @param {string} url Url for the media [optional]
 */
function addMedia(mediaId, name, type, url){
    
    mediaPlaying = true;
    timeManager.playVideo();
    currentSession.addMedia(mediaId, name, type, url);

}

/**
 * Closes an ongoing media session
 * @memberof DataManager
 */
function closeMedia(){
    
    mediaPlaying = false;
    timeManager.stopVideo();
    currentSession.closeMedia();

}

function playMedia(){

    let userPosition = '';
    if (dataCollector.callbacks.positionCallback){

        userPosition = dataCollector.callbacks.positionCallback();

    }

    registerEvent('vadrMedia Play', userPosition,
        {
            'ik': [],
            'iv': [],
            'fk': [],
            'fv': []
        },
        timeManager.getFrameUnixTime(), timeManager.getPlayTimeSinceStartSeconds());

    timeManager.playVideo();

}

function pauseMedia(){

    let userPosition = '';
    if (dataCollector.callbacks.positionCallback){

        userPosition = dataCollector.callbacks.positionCallback();

    }

    registerEvent('vadrMedia Pause', userPosition,
        {
            'ik': [],
            'iv': [],
            'fk': [],
            'fv': []
        }, 
        timeManager.getFrameUnixTime(), timeManager.getPlayTimeSinceStartSeconds());

    timeManager.pauseVideo();

}

function changeSeek(newSeek){

    let userPosition = '';
    if (dataCollector.callbacks.positionCallback){

        userPosition = dataCollector.callbacks.positionCallback();

    }

    registerEvent('vadrMedia Pause', userPosition,
        {
            'ik': ['oldSeek', 'newSeek'],
            'iv': [timeManager.getVideoDuration(), newSeek],
            'fk': [],
            'fv': []
        },
        timeManager.getFrameUnixTime(), timeManager.getPlayTimeSinceStartSeconds());

    timeManager.setVideoDuration(newSeek);

}

/**
 * Retuns the media state, true is media is playing, false if media is not playing
 * @memberof DataManager
 * @returns {boolean} media state
 */
function getMediaState(){

    return mediaPlaying;

}

/**
 * Adds event to event list of media if it exists, else to its own events list
 * @memberof DataManager
 * @param {string} eventName name of the event
 * @param {string} position 3D position associated with the event
 * @param {object} extra extra information and filter key-value pairs in the event
 */
function registerEvent(eventName, position, extra){

    currentSession.registerEvent(eventName, position, extra);

    // check size of events and handle making request
    _checkDataPairs();
    
}

/**
 * Destroys the current session
 * @memberof DataManager
 * @private
 */
function destroy(){

    _createDataRequest();

    if (timeSinceRequestChecker){

        clearInterval(timeSinceRequestChecker);
        timeSinceRequestChecker = null;

    }

}

// list all the private functions

/**
 * Manages creation of current session.
 * @memberof DataManager
 * @private
 */
function _createSession(){

    // can also check if any ealier session can be used
    if (!currentSession){
        
        currentSession = new session({});
        lastRequestTime = utils.getUnixTimeInSeconds();
        
    }

    // checks if time since last request has exceeded the maximum request time
    timeSinceRequestChecker = setInterval(
        () => {
            const currentTime = utils.getUnixTimeInSeconds();
            if (currentTime - lastRequestTime > config.getDataPostTimeInterval()){

                _createDataRequest();

            }
        }, 
        1000);

}

/**
 * Pushes the stored data till now to request manager, clears the session data
 * @memberof DataManager
 * @private
 */
function _createDataRequest(){

    logger.info('creating data request');
    const currentSessionData = currentSession.getDictionary();
    serverRequestManager.addDataRequest(currentSessionData);
    
    currentSession = currentSession.getDuplicate();
    lastRequestTime = utils.getUnixTimeInSeconds();

}

/**
 * Adds the total number of key value pairs in the event to eventDataPairs. If the 
 * eventDataPairs exceed max size, then submits a post request and clears session
 * @memberof DataManager
 * @private 
 */
function _checkDataPairs(){

    eventDataPairs++;
    if (eventDataPairs >= config.getMaxEventsNumber){

        _createDataRequest();

    }

}

export default {
    init,
    registerEvent,
    destroy,
    addScene, 
    closeScene,
    media: {
        addMedia: addMedia, 
        closeMedia: closeMedia,
        playMedia: playMedia,
        pauseMedia: pauseMedia, 
        changeSeek: changeSeek
    },
    getMediaState
};