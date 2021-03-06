import logger from './js/logger';
import config from './js/config';
import timeManager from './js/timeManager';
import user from './js/userData';
import deviceData from './js/deviceData';
import dataManager from './js/dataManager/dataManager';
import dataCollector from './js/dataCollector/dataCollector';
import constants from './js/constants';
import enums from './js/enums';

/**
 * @module VadrJSCore
 * @description Provides the core functionality for vadr analytics to platform 
 * specific SDKs such as AFrame, ReactVR.
 * To start using VadrAnalytics, please visit http://www.vadr.io.
 * To integrate our SDK, look out for platform specific SDK, for AFrame and ReactVR. 
 * If you are using any other platform for development, please reach out to abhishek@vadr.io.
 */
logger.setLogLevel(4);
let initState = false;

/**
 * inits the vadr analytics core for a new application
 * @param {*} params default event configuration and extra session metadata
 */
function initVadRAnalytics(params){

    timeManager.init();
    dataCollector.init();
    dataManager.init();
    deviceData.init();
    user.init();

    initState = true;

    // set initial params if provided
    _setParams(params);

}
/**
 * set the params for the application
 * @param {Object} params
 * @param {Object[]} params.defaultEvents array containing the configuretion for default events
 * @param {Object[]} params.sessionInfo array containing the meta data for session
 */
function _setParams(params){

    if(params){

        // set the data collection params
        if(params.defaultEvents){

            for (let i = 0; i < params.defaultEvents.length; i++){

                dataCollector.configureEventCollection(
                    params.defaultEvents[i].name,
                    params.defaultEvents[i].status,
                    params.defaultEvents[i].timePeriod
                );

            }

        }

        // set the session Info
        if(params.sessionInfo){

            for(let i = 0; i < params.sessionInfo.length; i++){

                dataManager.addSessionExtra(
                    params.sessionInfo[i].key,
                    params.sessionInfo[i].value
                );

            }
            
        }

        // set pauseOnHeadsetRemove
        if('pauseOnHeadsetRemove' in params){

            timeManager.setRemoveHeadsetPausesPlay(!!params['pauseOnHeadsetRemove']);

        }

    }

}

function tick(time, timeDelta){

    if (initState){
        
        timeManager.tick(timeDelta);
        dataCollector.tick();

    }

}

function destroy(){

    initState = false;
    dataManager.destroy();

}


export default {
    enums,
    logger,
    initVadRAnalytics,
    destroy,
    setLogLevel: logger.setLogLevel,
    config: {
        setApplication: config.setApplication,
        setSdk: config.setSdkType,
        setTestMode: config.setTestMode,
        setDefaultData: dataCollector.configureEventCollection,
        setRequestUrl: constants.setRequestUrl
    },
    user: {
        setUserId: userId => {user.setUserId(userId, true);},
        setUserAge: user.setAge,
        setUserGender: user.setGender,
        setUserInterests: user.setInterests,
        setInfo: user.setExtraInfo
    },
    setSessionInfo: dataManager.addSessionExtra,
    setDataConfig: {
        orientation: (status, timePeriod) => {
            dataCollector.configureEventCollection('Orientation', status, timePeriod);
        },
        gaze: (status, timePeriod) => {
            dataCollector.configureEventCollection('Gaze', status, timePeriod);
        },
        performance: (status, timePeriod) => {
            dataCollector.configureEventCollection('Performance', status, timePeriod);
        }
    },
    dataCallbacks: {
        setPositionCallback: dataCollector.setPositionCallback,
        setGazeCallback: dataCollector.setGazeCallback,
        setAngleCallback: dataCollector.setAngleCallback
    },
    tick,
    media: dataManager.media,
    scene: {
        addScene: dataManager.addScene,
        closeScene: dataManager.closeScene
    },
    registerEvent: (eventName, position, extra) => {
        
        if (position.length != 3 || isNaN(position[0]) || isNaN(position[1]) || 
            isNaN(position[2])){
            
            logger.error('Position needs to be array of number of length 3. Aborting');
            return;

        }
        
        const extraInfo = {
            'ik': [],
            'iv': [],
            'fk': [],
            'fv': []
        };

        for (let key in extra){

            const keyValue = extra[key];

            if (typeof(keyValue) == 'string'){

                extraInfo['fk'].push(key);
                extraInfo['fv'].push(keyValue);

            } else if(typeof(keyValue) == 'number') {

                extraInfo['ik'].push(key);
                extraInfo['iv'].push(keyValue);

            } else{

                logger.error('Extra information value type not recognized. Aborting.');
                return;

            }

        }

        const positionString = position[0].toFixed(4) + ',' + position[1].toFixed(4) +
            ',' + position[2].toFixed(4);

        dataManager.registerEvent(eventName, positionString, extraInfo);

    },
    playState: {
        appOutOfFocus: () => {timeManager.setAppActive(false);},
        appInFocus: () => {timeManager.setAppActive(true);},
        headsetRemoved: () => {timeManager.setHeadsetState(false);},
        headsetApplied: () => {timeManager.setHeadsetState(true);},
        pauseOnHeadsetRemove: () => {timeManager.setRemoveHeadsetPausesPlay(true);},
        dontPauseOnHeadsetRemove: () => {timeManager.setRemoveHeadsetPausesPlay(false);}
    }
};