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

function initVadRAnalytics(){

    timeManager.init();
    dataManager.init();

}

function tick(time, timeDelta){

    timeManager.setApplicationTimes(timeDelta);
    dataCollector.tick();

}

function destroy(){

    dataManager.destroy();

}


export default {
    initVadRAnalytics,
    destroy,
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
        
        dataManager.registerEvent(eventName, position, extra,
            timeManager.getFrameUnixTime(), timeManager.getPlayTimeSinceStartSeconds());

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