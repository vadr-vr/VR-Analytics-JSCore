import utils from './utils';
/**
 * @module ApplicationConfig
 * @description Contains the application specific information such as App id, token, 
 * version, test mode, default information collection frequency etc.
 */

let testMode = false;
let dataPostTimeInterval = 30;
let dataPostMaxEvents = 1000;

let sdkType = 'vadrCore';

const appConfig = {
    'appId': null,
    'appToken': null,
    'version': null
};

/**
 * Sets the application details such as appId, appToken, version
 * @memberof ApplicationConfig
 * @param {string} appId application id provided by vadr
 * @param {token} token application token provided by vadr
 * @param {version} version version of application set by developer
 */
function setApplication(appId, token, version){

    appConfig['appId'] = appId;
    appConfig['appToken'] = token;
    appConfig['version'] = version;

}

/**
 * Returns the application config set by user
 * @memberof ApplicationConfig
 * @returns {object} cloned version of application config dict
 */
function getApplicationConfig(){

    if (appConfig['appId'] && appConfig['appToken'] && appConfig['version'])
        return utils.deepClone(appConfig);
    else 
        return null;

}

/**
 * Sets the SDK type used by the application. Set by the platform implementation
 * @memberof ApplicationConfig
 * @param {string} sdk sdk type
 */
function setSdkType(sdk){

    sdkType = sdk;

}

/**
 * Returns the platform SDK is used for
 * @memberof ApplicationConfig
 * @returns {string} sdkType
 */
function getSdkType(){

    return sdkType;

}

/**
 * Sets the test mode of the application
 * @memberof ApplicationConfig
 * @param {boolean} test set it to true while developing, false when shipping in 
 * production
 */
function setTestMode(test){

    testMode = !!test;

}

/**
 * Returns the test mode value
 * @memberof ApplicationConfig
 * @returns {boolean} testMode
 */
function getTestMode(){

    return testMode;

}

/**
 * Returns the time interval between send data request
 * @memberof ApplicationConfig
 * @returns {number} 
 */
function getDataPostTimeInterval(){

    return dataPostTimeInterval;

}

/**
 * Returns the max number of events after which a request is scheduled to the server
 * @memberof ApplicationConfig
 * @returns {number}
 */
function getMaxEventsNumber(){

    return dataPostMaxEvents;

}

export default {
    getApplication: {
        id: () => appConfig.appId,
        token: () => appConfig.appToken,
        version: () => appConfig.version
    },
    setApplication,
    setSdkType,
    setTestMode,
    getApplicationConfig,
    getSdkType,
    getTestMode,
    getDataPostTimeInterval,
    getMaxEventsNumber
};