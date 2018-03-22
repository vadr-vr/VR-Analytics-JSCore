import uuid from 'uuid-js';
import config from './config';
/**
 * @module Utils
 * @description Contains utility functions
 */

let vadrDate = Date;

if (!vadrDate.now){

    vadrDate.now = function(){

        return (new Date()).getTime();

    };

}

/**
 * Used to generate session, sceneSession or mediaSession tokens
 * @memberof Utils
 * @returns {string} unique token
 */
function getToken(){

    return uuid.create().hex;

}

/**
 * Used to get unix time in seconds
 * @memberof Utils
 * @returns {number} unix time in seconds
 */
function getUnixTimeInSeconds(){

    return Math.round(vadrDate.now() / 1000);

}

/**
 * Used to get unix time in milliseconds
 * @memberof Utils
 * @returns {number} unix time in milliseconds
 */
function getUnixTimeInMilliseconds(){
    
    return vadrDate.now();

}

/**
 * Used to get rounded seconds from milliseconds
 * @memberof Utils
 * @returns {number} seconds in integer
 */
function convertMillisecondsToSeconds(milliseconds){

    return Math.round(milliseconds / 1000);

}

/**
 * Used to get float seconds from milliseconds
 * @memberof Utils
 * @returns {number} seconds in float
 */
function convertMillisecondsToSecondsFloat(milliseconds){

    return Math.round(milliseconds) / 1000;

}

/**
 * Deep clones dictionary
 * @memberof Utils
 * @param {object} inputDict Dictionary to clone
 * @returns {object} cloned dictionary
 */
function deepClone(inputDict){

    if (!inputDict)
        return null;

    const clonedDict = {};

    for (let key in inputDict){

        if (typeof(inputDict[key]) == 'object'){

            clonedDict[key] = deepClone(inputDict[key]);
        
        }
        else{

            clonedDict[key] = inputDict[key];

        }

    }

    return clonedDict;

}

function _getAppPrefix(){

    const appConfig = config.getApplicationConfig();
    if (appConfig){

        return '__app_' + appConfig.appId + '__version_' + appConfig.version;

    }else{

        return '';

    }

}

/**
 * Sets the cookie with the given name, value and validity. Appends appId and version information 
 * in the cookie name automatically
 * @memberof Utils
 * @param {string} cookieName name of the cookie
 * @param {string} value value of the cookie
 * @param {Date} validity valid till date object
 */
function setCookie(cookieName, value, validity, useAppPrefix = true){

    const appPrefix = useAppPrefix ? _getAppPrefix() : '';
    const cookieString = appPrefix + cookieName + '=' + value + ';' + 'expires=' + 
        validity.toUTCString();

    document.cookie = cookieString;


}

function getCookie(cookieName, useAppPrefix = true){

    // append app id and version information to cookie name
    if (useAppPrefix){

        cookieName = _getAppPrefix() + cookieName;

    }

    const allCookies = document.cookie;

    if (allCookies.indexOf(cookieName) == -1)
        return null;
    
    const cookieList = allCookies.split(';');

    for (let i = 0; i < cookieList.length; i++){

        const cookieString = cookieList[i].replace(/\s/g, '');

        if (cookieString.startsWith(cookieName)){

            let separatorIndex= cookieString.indexOf('=');

            if (separatorIndex > 0){

                const cookieValue = cookieString.substring(separatorIndex + 1);
                
                if (cookieValue)
                    return cookieValue;
                else 
                    return null;

            } else {

                return null;

            }

        }

    }

    return null;

}

// get normalized data point duration
function getDataPointDuration(duration){

    if (duration > 1000){

        return 1;

    }else{

        return duration / 1000;

    }
    
}

export default {
    getToken,
    getUnixTimeInSeconds,
    getUnixTimeInMilliseconds,
    convertMillisecondsToSeconds,
    convertMillisecondsToSecondsFloat,
    deepClone,

    setCookie,
    getCookie,

    getDataPointDuration
};