import uuid from 'uuid-js';
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

/**
 * Sets the cookie with the given name, value and validity
 * @param {string} cookieName name of the cookie
 * @param {string} value value of the cookie
 * @param {Date} validity valid till date object
 */
function setCookie(cookieName, value, validity){

    const cookieString = cookieName + '=' + value + ';' + 'expires=' + 
        validity.toUTCString();

    document.cookie = cookieString;


}

function getCookie(cookieName){

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

export default {
    getToken,
    getUnixTimeInSeconds,
    getUnixTimeInMilliseconds,
    convertMillisecondsToSeconds,
    convertMillisecondsToSecondsFloat,
    deepClone,

    setCookie,
    getCookie
};