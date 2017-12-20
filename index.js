import logger from './js/logger';
import config from './js/config';
import timeManager from './js/timeManager';
import user from './js/userData';
import deviceData from './js/deviceData';
import dataManager from './js/dataManager/dataManager';
import dataCollector from './js/dataCollector/dataCollector';

/**
 * @module VadrJSCore
 * @description Provides the core functionality for vadr analytics to platform 
 * specific SDKs such as AFrame, ReactVR.
 * Checks for default events that need to be generated at each frame.
 * Makes calls to generate default events.
 * Provides unix time of each frame begin to all modules.
 */
logger.setLogLevel(4);

function sayHi(){
    logger.info('VadR says Hii');
}

function initVadRAnalytics(){

    timeManager.init();
    dataManager.init();

}


export default {
    sayHi,
    initVadRAnalytics,
    setLogLevel: logger.setLogLevel,
    config: {
        setApplication: config.setApplication,
        setSdk: config.setSdkType,
        setTestMode: config.setTestMode,
        setDefaultData: dataCollector.configureEventCollection
    },
    user: {
        setUserId: userId => {user.setUserId(userId, true);},
        setInfo: user.setExtraInfo
    },
    dataCallbacks: {
        setPositionCallback: dataCollector.setPositionCallback,
        setGazeCallback: dataCollector.setGazeCallback,
        setAngleCallback: dataCollector.setAngleCallback
    },
    media: {
        start: null,
        play: null,
        pause: null,
        seekVideo: null
    },
    event: {
        setEvent: null
    } 

};