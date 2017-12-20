import logger from '../logger';
import orientationCollector from './orientationCollector';
import gazeCollector from './gazeCollector';
import performanceCollector from './performanceCollector';
import dataManager from '../dataManager/dataManager';
import timeManager from '../timeManager';

/**
 * @module DataCollector
 * @description Manages the collection of default events
 */

// contains the default events that can be collected
const gazeDict = {
    'timePeriod': 200,
    'lastFetchTime': 0,
    'status': false,
    'calculator': gazeCollector
};

const orientationDict = {
    'timePeriod': 200,
    'lastFetchTime': 0,
    'status': false,
    'calculator': orientationCollector
};

const performanceDict = {
    'timePeriod': 200,
    'lastFetchTime': 0,
    'status': false,
    'calculator': performanceCollector
};

const dataConfig = {
    'Gaze': gazeDict,
    'Orientation': orientationDict,
    'Performance': performanceDict,
};

/**
 * Sets the function to call when setting position
 * @memberof DataCollector
 * @param {function} positionFunction  
 */
function setCallbackPosition(positionFunction){

    if (typeof(positionFunction) == 'function')
        orientationCollector.setPositionCallback(positionFunction);
    else
        logger.warn('Trying to set a non function object as position callback');

}

/**
 * Sets the function to call when calculating gaze hit point
 * @memberof DataCollector
 * @param {function} gazeFunction 
 */
function setCallbackGaze(gazeFunction){

    if (typeof(gazeFunction) == 'function')
        gazeCollector.setGazeCallback(gazeFunction);
    else
        logger.warn('Trying to set a non function object as gaze callback');
    
}

/**
 * Sets the function to call when calculating gaze hit point
 * @memberof DataCollector
 * @param {function} angleFunction 
 */
function setCallbackAngle(angleFunction){

    if (typeof(angleFunction) == 'function')
        gazeCollector.setAngleCallback(angleFunction);
    else
        logger.warn('Trying to set a non function object as angle callback');
    
}

/**
 * Configures which events to collect by default and by what frequency
 * @memberof DataCollector
 * @param {*} eventType 
 * @param {*} collectionStatus 
 * @param {*} timePeriod 
 */
function configureEventCollection(eventType, collectionStatus, timePeriod){

    if (eventType in dataConfig){

        dataConfig[eventType].status = collectionStatus;
        dataConfig[eventType].timePeriod = timePeriod;

    }

}

/**
 * Checks if any default data needs to be collected after each frame
 * @memberof DataCollector
 */
function tick(){

    const useMedia = dataManager.getMediaState();
    const playTimeSinceStart = timeManager.getPlayTimeSinceStart();

    for (let key in dataConfig){

        const infoDict = dataConfig[key];

        if (infoDict.status && 
            playTimeSinceStart - infoDict.lastFetchTime > infoDict.timePeriod){

            infoDict.lastFetchTime = playTimeSinceStart;

            if (useMedia)
                _setEvents(infoDict.calculator.getMediaEvents());
            else
                _setEvents(infoDict.calculator.getEvents());

        }

    }

}

// collects the events from the given array and adds to datamanager
function _setEvents(eventsArray){

    for (let i = 0; i < eventsArray.length; i++){

        let event = eventsArray[i];
        dataManager.registerEvent(event[0], event[1], event[2], 
            timeManager.getFrameUnixTime, timeManager.getPlayTimeSinceStart);

    }

}

export default {
    setCallbackPosition,
    setCallbackGaze,
    setCallbackAngle,
    configureEventCollection,
    tick
};