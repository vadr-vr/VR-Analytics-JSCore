/**
 * @module AnalyticsController
 * @description Main class responsible for the working of analytics core
 * Checks for default events that need to be generated at each frame
 * Makes calls to generate default events
 * Provides unix time of each frame begin to all modules
 */

// frame time used to provide single frame time value to all modules
let frameUnixTime = null;
// timeSinceStart used to provide milliseconds start time
let timeSinceStart = null;

/**
 * returns the unixTime of start of frame
 * @member
 * @returns {number} unixTime
 */
function getFrameUnixTime(){

    return frameUnixTime;

}

export default {
    getFrameUnixTime
};

// TODO - handle game pause, controller removed etc.