/**
 * @module TimeManager
 * @description Manages the different timings in the web application
 */

/**
 * unix time of the current frame
 * @memberof TimeManager
 * @private
 */ 
let frameUnixTime = null;
/**
 *  previous frame duration in milliseconds
 * @memberof TimeManager
 * @private
 */
let frameDuration = 0;
/**
 *  time in milliseconds of app use time ie. exluding window switches, headset removed etc.
 * @memberof TimeManager
 * @private
 */
let timeSinceStart = 0; 
/**
 *  time in milliseconds of actual use time ie. also excluding app pauses, menu toggles etc.
 * @memberof TimeManager
 * @private
 */
let playTimeSinceStart = 0;

/**
 * Updates the application timings.
 * Calculates frameTime as the difference of current 
 * frame time and the previous frame time. In case app was not active the previous frame,
 * sets the frame time to 0. Correspondingly calculates timeSinceStart and playTimeSinceStart 
 * @memberof TimeManager
 * @param {number} unixTime unix time of the current frame
 * @param {boolean} appActive specifies if the app was in focus during the last frame
 * @param {boolean} appPlaying specifies if the app is playing or  paused
 */
function setApplicationTimes(unixTime, appActive, appPlaying){

    frameDuration = appActive ? unixTime - frameUnixTime : 0;
    frameUnixTime = unixTime;
    timeSinceStart += frameDuration;
    playTimeSinceStart = appPlaying ? playTimeSinceStart + frameDuration : playTimeSinceStart;

}

/**
 * Reset the timings, sets the frame time to unix time provided, reset others
 * @param {number} unixTime new unix time of the frame 
 */
function reset(unixTime){

    frameUnixTime = unixTime;
    frameDuration = 0;
    timeSinceStart = 0;
    playTimeSinceStart = 0;

}

/**
 * Get the frameUnixTime
 * @memberof TimeManager
 * @returns {number} unixTime of the current frame 
 */
function getFrameUnixTime(){
    
    return frameUnixTime;

}
    
/**
 * Get the previous frame duration
 * @memberof TimeManager
 * @returns {number} duration of the previous frame
 */
function getFrameDuration(){
    
    return frameDuration;

}

/**
 * Get time since start of application
 * @memberof TimeManager
 * @returns {number}  
 */
function getTimeSinceStart(){
    
    return timeSinceStart;

}

/**
 * Get actual play time since start
 * @memberof TimeManager
 * @returns {number}  
 */
function getPlayTimeSinceStart(){
    
    return playTimeSinceStart;

}

export default {
    setApplicationTimes,
    reset,
    getFrameUnixTime,
    getFrameDuration,
    getTimeSinceStart,
    getPlayTimeSinceStart
};