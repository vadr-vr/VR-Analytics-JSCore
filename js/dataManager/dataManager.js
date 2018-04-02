import logger from '../logger';
import utils from '../utils';
import sessionManager from './sessionManager';
import config from '../config';
import enums from '../enums';
import timeManager from '../timeManager';
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

    eventDataPairs = 0;
    currentSession = sessionManager.createSession();
    lastRequestTime = utils.getUnixTimeInSeconds();
    mediaPlaying = false;

    // checks if time since last request has exceeded the maximum request time
    if (timeSinceRequestChecker){

        clearInterval(timeSinceRequestChecker);
        timeSinceRequestChecker = null;

    }

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
 * Add extra information to the session
 * @memberof DataManager
 * @param {string} infoKey key which identifies the information, max 50 characters
 * @param {string, number} infoValue should be float or string with max 100 characters
 */
function addSessionExtra(infoKey, infoValue){

    currentSession.setExtra(infoKey, infoValue);

}
// Functions related to creating and deleting scene sessions and media sessions
/**
 * create scene session
 * @memberof DataManager
 * @param {string} sceneId id of the new scene [optional - either this or sceneName]
 * @param {string} sceneName name of the new scene [optional - either this or sceneId]
 */
function addScene(sceneId, sceneName){

    if (!sceneId && !sceneName){

        logger.warn('SceneId or SceneName is required to starting a new scene session. Aborting');
        return;
        
    }

    // close any previous media
    if (mediaPlaying)
        closeMedia();

    currentSession.addScene(sceneId, sceneName);

}

/**
 * close the ongoing scene
 * @memberof DataManager
 */
function closeScene(){

    // close any previous media
    if (mediaPlaying)
        closeMedia();

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
    
    // close any previous media
    if (mediaPlaying)
        closeMedia();
        
    if (type != enums.media360.video && type != enums.media360.image){

        logger.warn('Media type not supported. Aborting addind media.');
        return;
    
    }

    if (type == enums.media360.video){

        timeManager.playVideo();

    }

    mediaPlaying = true;
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

    registerEvent('vadrVideo Play', null,
        {
            'ik': [],
            'iv': [],
            'fk': [],
            'fv': []
        });

    timeManager.playVideo();

}

function pauseMedia(){

    registerEvent('vadrVideo Pause', null,
        {
            'ik': [],
            'iv': [],
            'fk': [],
            'fv': []
        });

    timeManager.pauseVideo();

}

function changeSeek(newSeek){

    const oldSeek = timeManager.getVideoDuration();
    timeManager.setVideoDuration(newSeek);
    
    registerEvent('vadrVideo Seek', null,
        {
            'ik': ['From Time', 'To Time'],
            'iv': [oldSeek, newSeek],
            'fk': [],
            'fv': []
        });

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
 * Pushes the stored data till now to request manager, clears the session data
 * @memberof DataManager
 * @private
 */
function _createDataRequest(){

    logger.info('Creating data request');
    const currentSessionData = currentSession.getDictionary();
    serverRequestManager.addDataRequest(currentSessionData);
    
    currentSession = currentSession.getDuplicate();
    lastRequestTime = utils.getUnixTimeInSeconds();
    sessionManager.setSessionCookie();

}

/**
 * Adds the total number of key value pairs in the event to eventDataPairs. If the 
 * eventDataPairs exceed max size, then submits a post request and clears session
 * @memberof DataManager
 * @private 
 */
function _checkDataPairs(){

    eventDataPairs++;
    if (eventDataPairs >= config.getMaxEventsNumber()){

        _createDataRequest();

    }

}

export default {
    init,
    destroy,

    addSessionExtra,
    registerEvent,
    
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