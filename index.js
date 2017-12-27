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
 * To start using VadrAnalytics, please visit http://www.vadr.io.
 * To integrate our SDK, look out for platform specific SDK, for AFrame and ReactVR. 
 * If you are using any other platform for development, please reach out to abhishek@vadr.io.
 */
logger.setLogLevel(4);

function initVadRAnalytics(){

    timeManager.init();
    dataManager.init();
    deviceData.init();

}

function tick(time, timeDelta){

    timeManager.tick(timeDelta);
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

        dataManager.registerEvent(eventName, position, extraInfo);

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