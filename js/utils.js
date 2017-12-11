import uuid from 'uuid';
/**
 * @module Utils
 * @description Contains utility functions
 */

/**
 * Used to generate session, sceneSession or mediaSession tokens
 * @memberof Utils
 * @returns {string} unique token
 */
function getToken(){
    return uuid.v4();
}

/**
 * Used to get unix time in seconds
 * @memberof Utils
 * @returns {number} unix time in seconds
 */
function getUnixTimeInSeconds(){

    return Math.round((new Date()).getTime() / 1000);

}

/**
 * Used to get unix time in milliseconds
 * @memberof Utils
 * @returns {number} unix time in milliseconds
 */
function getUnixTimeInMilliseconds(){
    
    return (new Date()).getTime();

}

/**
 * Used to get seconds from milliseconds
 * @memberof Utils
 * @returns {number} duration in milliseconds
 */
function convertMillisecondsToSeconds(milliseconds){

    return Math.round(milliseconds / 1000);

}

export default {
    getToken,
    getUnixTimeInSeconds,
    getUnixTimeInMilliseconds,
    convertMillisecondsToSeconds
};