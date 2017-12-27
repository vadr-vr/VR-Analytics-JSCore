import utils from './utils';
import dataCollector from './dataCollector/dataCollector';
/**
 * @module TimeManager
 * @description Manages the different timings in the web application
 */

// unix time of the current frame
let frameUnixTime = null;
// previous frame duration in milliseconds
let frameDuration = 0;
let frameDurationClone = 0;
// time in milliseconds of app use time ie. exluding window switches, headset removed etc.
let timeSinceStart = 0; 
// time in milliseconds of actual use time ie. also excluding app pauses, menu toggles etc
let playTimeSinceStart = 0;
// tells if application is in focus
let appActive = true;
// tells if headset is put off in case of VR etc.
let appPlaying = true;
let removeHeadsetPausesPlay = true;

let videoDuration = 0;
let videoPlaying = false;

/**
 * Init the time manager, sets frameUnixTime to current value
 * @memberof TimeManager
 */
function init(){

    frameUnixTime = utils.getUnixTimeInMilliseconds();
    frameDuration = 0;
    frameDurationClone = 0;
    timeSinceStart = 0;
    playTimeSinceStart = 0;
    appActive = true;
    appPlaying = true;
    videoDuration = 0;
    videoPlaying = false;

}

/**
 * Updates the application timings.
 * Calculates frameTime as the difference of current 
 * frame time and the previous frame time. In case app was not active the previous frame,
 * sets the frame time to 0. Correspondingly calculates timeSinceStart and 
 * playTimeSinceStart 
 * @memberof TimeManager
 * @param {number} frameTime specify the frameDuration if known [optional]
 */
function tick(frameTime){

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
 * toggle appActive flag
 * @memberof TimeManager
 */
function setAppActive(newState){

    appActive = !!newState;

}

/**
 * toggle if removing headset pauses play time
 * @memberof TimeManager
 * @param {boolean} newState true if play is to be paused on removing headset, else false
 */
function setRemoveHeadsetPausesPlay(newState){

    removeHeadsetPausesPlay = !!newState;

}

/**
 * toggle headset put on / removed
 * @memberof TimeManager
 * @param {boolean} newState new headset state, true id put on, false if taken off
 */
function setHeadsetState(newState){

    if (newState){

        appPlaying = true;
        appActive = true;

    }else{

        if (removeHeadsetPausesPlay)
            appPlaying = false;

    }


}

/**
 * Reset the timings, sets the frame time to unix time provided, reset others
 * @memberof TimeManager
 */
function reset(){

    frameUnixTime = utils.getUnixTimeInMilliseconds();
    timeSinceStart = 0;
    playTimeSinceStart = 0;
    dataCollector.reset();

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

    return Math.round(videoDuration * 1000) / 1000;

}

export default {
    init,
    tick,
    reset,
    setAppActive,
    setRemoveHeadsetPausesPlay,
    setHeadsetState,

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