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

const userAgent = navigator.userAgent;
const language = navigator.language;
const deviceDetails = parser(userAgent);

deviceInfo['userAgent'] = userAgent;

if (language)
    deviceInfo['language'] = language;

if (deviceDetails.os){

    if (deviceDetails.os.name)
        deviceInfo['os'] = deviceDetails.os.name;

    if (deviceDetails.os.version)
        deviceInfo['osv'] = deviceDetails.os.version;

}

if (deviceDetails.browser){

    const browserInfo = {};

    if (deviceDetails.browser.name)
        browserInfo['name'] = deviceDetails.browser.name;

    if (deviceDetails.browser.version)
        browserInfo['version'] = deviceDetails.browser.version;

    deviceInfo['browser'] = browserInfo;

}

_getSetDeviceIdentifier();

logger.debug('Device info is', deviceInfo);

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
    const allCookies = document.cookie;

    if (allCookies.indexOf(deviceCookieName) == -1)
        return null;
    
    const cookieList = allCookies.split(';');

    for (let i = 0; i < cookieList.length; i++){

        const cookieString = cookieList[i].replace(/\s/g, '');

        if (cookieString.startsWith(deviceCookieName)){

            let separatorIndex= cookieString.indexOf('=');

            if (separatorIndex > 0){

                const deviceId = cookieString.substring(separatorIndex + 1);
                
                if (deviceId)
                    return deviceId;
                else 
                    return null;

            } else {

                return null;

            }

        }

    }

    return null;

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
    const cookieString = deviceCookieName + '=' + deviceId + ';' + 'expires=' + 
        laterDate.toUTCString();

    document.cookie = cookieString;
    
    return deviceId;

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

export default {
    getDeviceId,
    getDeviceInformation
};

/*
    Tests
    device information can be changed anytime during user, should be updated accordingly

    TODO
    update support for user agent and browser details in backend
*/
