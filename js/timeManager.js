import utils from './utils';
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
let frameDurationClone = 0;
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

let videoDuration = 0;
let videoPlaying = false;

/**
 * Init the time manager, sets frameUnixTime to current value
 * @memberof TimeManager
 */
function init(){

    frameUnixTime = utils.getUnixTimeInMilliseconds();

}

/**
 * Updates the application timings.
 * Calculates frameTime as the difference of current 
 * frame time and the previous frame time. In case app was not active the previous frame,
 * sets the frame time to 0. Correspondingly calculates timeSinceStart and 
 * playTimeSinceStart 
 * @memberof TimeManager
 * @param {boolean} appActive specifies if the app was in focus during the last frame
 * @param {boolean} appPlaying specifies if the app is playing or  paused
 * @param {number} frameTime specify the frameDuration if known [optional]
 */
function setApplicationTimes(appActive, appPlaying, frameTime){

    let newFrameUnixTime = utils.getUnixTimeInMilliseconds();
    if (frameTime)
        frameDuration = frameTime;
    else
        frameDuration = newFrameUnixTime - frameUnixTime;
    
    // dont consider frame duration if app is not active
    frameDurationClone = appActive ? frameDuration : 0;

    frameUnixTime = newFrameUnixTime;
    timeSinceStart += frameDurationClone;

    if (appPlaying){

        playTimeSinceStart += frameDurationClone;
        
    }

    if (videoPlaying){

        videoDuration += utils.convertMillisecondsToSecondsFloat(frameDurationClone);

    }


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
 * @returns {number} duration of the previous frame in milliseconds
 */
function getFrameDuration(){
    
    return frameDuration;

}

/**
 * Get the previous frame duration
 * @memberof TimeManager
 * @returns {number} duration of the previous frame in seconds
 */
function getFrameDurationSeconds(){
    
    return parseInt(frameDuration) / 1000;

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

/**
 * Get actual play time since start in seconds
 * @memberof TimeManager
 * @returns {number}  
 */
function getPlayTimeSinceStartSeconds(){
    
    return parseInt(playTimeSinceStart) / 1000;

}

// function related to video duration

/**
 * Play the video, use to 1. create new video (assumes video duration was set to 
 * 0 by the last video stop call) 2. play existing paused video.
 * @memberof TimeManager 
 */
function playVideo(){

    videoPlaying = true;

}

/**
 * Pause the currently playing video
 * @memberof TimeManager
 */
function pauseVideo(){

    videoPlaying = false;

}

/**
 * Stop the currently playing video. Resets the video duration to 0
 * @memberof TimeManager
 */
function stopVideo(){

    videoDuration = 0;
    videoPlaying = false;

}

/**
 * Set new seek positon of the currently playing video
 * @memberof TimeManager
 */
function setVideoDuration(newSeek){

    videoDuration = newSeek;

}

/**
 * Gets the video play state, true if playing, false if not playing or paused
 * @memberof TimeManager
 */
function getVideoState(){

    return videoPlaying;

}

/**
 * Get the current seek position of the playing video
 * @memberof TimeManager
 */
function getVideoDuration(){

    return videoDuration;

}

export default {
    init,
    setApplicationTimes,
    reset,
    getFrameUnixTime,
    getFrameDuration,
    getFrameDurationSeconds,
    getTimeSinceStart,
    getPlayTimeSinceStart,
    getPlayTimeSinceStartSeconds,

    playVideo,
    pauseVideo, 
    stopVideo,
    setVideoDuration, 
    getVideoDuration,
    getVideoState
};