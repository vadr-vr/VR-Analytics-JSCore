import parser from 'ua-parser-js';
import logger from './logger';
import constants from './constants';
import utils from './utils';

/**
 * @method DeviceData
 * @description Contains the information for the device
 */

const deviceInfo = {
    'deviceId': null,
};
let browserInfo = {};

const userAgent = navigator.userAgent;
const language = navigator.language;
const deviceDetails = parser(userAgent);

browserInfo['userAgent'] = userAgent;

if (language)
    deviceInfo['language'] = language;

if (deviceDetails.os){

    if (deviceDetails.os.name)
        deviceInfo['os'] = deviceDetails.os.name;

    if (deviceDetails.os.version)
        deviceInfo['osv'] = deviceDetails.os.version;

}

if (deviceDetails.browser){

    if (deviceDetails.browser.name)
        browserInfo['browserName'] = deviceDetails.browser.name;

    if (deviceDetails.browser.version)
        browserInfo['browserVersion'] = deviceDetails.browser.version;

}

_getSetDeviceIdentifier();

/**
 * Tries to fetch deviceId from cookie, else set a new cookie
 * @private
 * @memberof DeviceData
 */
function _getSetDeviceIdentifier(){

    let deviceId = _getVadrDeviceFromCookie();

    if (!deviceId)
        deviceId = _setVadrDeviceCookie();

    deviceInfo['deviceId'] = deviceId;

}

// fetches the deviceId from cookie
function _getVadrDeviceFromCookie(){

    const deviceCookieName = constants.deviceCookieName;

    return utils.getCookie(deviceCookieName);

}

// sets the deviceId to Cookie
function _setVadrDeviceCookie(){

    // setting cookie valid for years set in constants
    const cookieValidFor = constants.cookieValidForYears;
    const deviceCookieName = constants.deviceCookieName;

    const currentDate = new Date();
    const laterDate = new Date();
    laterDate.setFullYear(currentDate.getFullYear() + cookieValidFor);

    const deviceId = utils.getToken();

    utils.setCookie(deviceCookieName, deviceId, laterDate);
    
    return deviceId;

}

/**
 * Perform any functions needed after vadrAnalytics is initialized
 * @memberof DeviceData
 */
function init(){

    logger.debug('Device info is', deviceInfo);
    logger.debug('Browser info is', browserInfo);
    
}

/**
 * Returns the deviceId of the device
 * @memberof DeviceData
 * @returns {string} deviceId 
 */
function getDeviceId(){

    return deviceInfo['deviceId'];

}

/**
 * Returns the device information dictionary
 * @memberof DeviceData
 * @returns {object} deviceInformation
 */
function getDeviceInformation(){

    return utils.deepClone(deviceInfo);

}

/**
 * Returns the broser details like name, version and user agent
 * @returns {object} broserInformation
 */
function getBrowserInfo(){

    return utils.deepClone(browserInfo);

}

export default {
    init,
    getDeviceId,
    getDeviceInformation,
    getBrowserInfo
};

/*
    Tests
    device information can be changed anytime during user, should be updated accordingly

    TODO
    update support for user agent and browser details in backend
*/
