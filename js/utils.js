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

    return milliseconds / 1000;

}

/**
 * Deep clones dictionary
 * @memberof Utils
 * @param {object} inputDict Dictionary to clone
 * @returns {object} cloned dictionary
 */
function deepClone(inputDict){

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

export default {
    getToken,
    getUnixTimeInSeconds,
    getUnixTimeInMilliseconds,
    convertMillisecondsToSeconds,
    convertMillisecondsToSecondsFloat,
    deepClone
};