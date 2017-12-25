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

const callbacks = {
    positionCallback: null,
    gazeCallback: null,
    angleCallback: null
};

// contains the default events that can be collected
const gazeDict = {
    'timePeriod': 200,
    'lastFetchTime': 0,
    'status': true,
    'calculator': gazeCollector
};

const orientationDict = {
    'timePeriod': 200,
    'lastFetchTime': 0,
    'status': true,
    'calculator': orientationCollector
};

const performanceDict = {
    'timePeriod': 200,
    'lastFetchTime': 0,
    'status': true,
    'calculator': performanceCollector
};

const dataConfig = {
    'Gaze': gazeDict,
    'Orientation': orientationDict,
    'Performance': performanceDict
};

/**
 * Sets the function to call when setting position
 * @memberof DataCollector
 * @param {function} positionFunction  
 */
function setPositionCallback(positionFunction){

    if (typeof(positionFunction) == 'function'){

        orientationCollector.setPositionCallback(positionFunction);
        callbacks.positionCallback = positionFunction;

    }
    else
        logger.warn('Trying to set a non function object as position callback');

}

/**
 * Sets the function to call when calculating gaze hit point
 * @memberof DataCollector
 * @param {function} gazeFunction 
 */
function setGazeCallback(gazeFunction){

    if (typeof(gazeFunction) == 'function'){

        gazeCollector.setGazeCallback(gazeFunction);
        callbacks.gazeCallback = gazeFunction;

    }
    else
        logger.warn('Trying to set a non function object as gaze callback');
    
}

/**
 * Sets the function to call when calculating gaze hit point
 * @memberof DataCollector
 * @param {function} angleFunction 
 */
function setAngleCallback(angleFunction){

    if (typeof(angleFunction) == 'function'){

        gazeCollector.setAngleCallback(angleFunction);
        callbacks.angleCallback = angleFunction;

    }
    else
        logger.warn('Trying to set a non function object as angle callback');
    
}

/**
 * Configures which events to collect by default and by what frequency
 * @memberof DataCollector
 * @param {string} eventType type of event - Orientation, Gaze, Performance
 * @param {boolean} collectionStatus set to true if you want to collect the event
 * @param {number} timePeriod time period in milliseconds after which to collect the data
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

    performanceCollector.tick();

    const useMedia = dataManager.getMediaState();
    const playTimeSinceStart = timeManager.getPlayTimeSinceStart();

    for (let key in dataConfig){

        const infoDict = dataConfig[key];

        if (infoDict.status && 
            playTimeSinceStart - infoDict.lastFetchTime > infoDict.timePeriod){

            const timeDifferene = playTimeSinceStart - infoDict.lastFetchTime;

            if (useMedia)
                _setEvents(infoDict.calculator.getMediaEvents(timeDifferene));
            else
                _setEvents(infoDict.calculator.getEvents(timeDifferene));
                
            infoDict.lastFetchTime = playTimeSinceStart;

        }

    }

}

// collects the events from the given array and adds to datamanager
function _setEvents(eventsArray){

    for (let i = 0; i < eventsArray.length; i++){

        let event = eventsArray[i];
        dataManager.registerEvent(event[0], event[1], event[2]);

    }

}

/**
 * Reset the last fetch time of all the events, used when timeManager resets
 * @memberof DataCollector
 */
function reset(){

    for (let key in dataConfig){

        dataConfig[key].lastFetchTime = 0;

    }

}

function destroy(){

    callbacks.positionCallback = null;
    callbacks.gazeCallback = null;
    callbacks.angleCallback = null;

    for (let key in dataConfig){

        dataConfig[key].calculator.destroy();

    }

}

export default {
    setPositionCallback,
    setGazeCallback,
    setAngleCallback,
    callbacks,
    configureEventCollection,
    tick,
    reset,
    destroy
};