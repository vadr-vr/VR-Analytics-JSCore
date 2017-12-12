/**
 * @module ApplicationConfig
 * @description Contains the application specific information such as App id, token, 
 * version, test mode, default information collection frequency etc.
 */

let testMode = false;

const applicationConfig = {
    'appId': '',
    'appToken': '',
    'version': ''
};

const dataConfig = {
    'Gaze': {
        'timePeriod': 200,
        'status': true,
        'events': ['vadrGaze', 'vadrMedia Gaze']
    },
    'Orientation': {
        'timePeriod': 200,
        'status': true,
        'events': ['vadrPosition', 'vadrMedia Position']
    },
    'Performance': {
        'timePeriod': 200,
        'status': true,
        'events': ['FPS', 'CPU Usage', 'Memory ResidentUsage', 'Memory SwapUsage']
    },
    'TrackObjects': {
        'timePeriod': 200,
        'status': true,
        'events': ['vadrObject Gaze', 'vadrObject Focus']
    }
};

/**
 * Sets the test mode of the application
 * @param {boolean} test set it to true while developing, false when shipping in 
 * production
 */
function setTestMode(test){

    test == !!test;
    testMode = test;

}

/**
 * Returns the test mode value
 * @returns {boolean} testMode
 */
function getTestMode(){

    return testMode;

}

export default {
    setTestMode,
    getTestMode
};
/**
 * 
 */


/*
    Gaze - user position
        'vadrGaze'
        'vadrMedia Gaze' - 
            'Status' : 'Paused'

    Orientation - user position
        'vadrPosition'
        'vadrMedia Position'
            for both
            'Time'
            'Velocity X'
            'Velocity Y'
            'Velocity Z'

    Performance - user position
        'vadrPerformance'
            'FPS'
            'Cpu Usage'
            'Memory ResidentUsage'
            'Memory SwapUsage'

    Track Objects
        'vadrObject Gaze' - position is the intersect of raycast on object
            'Time'
            Filter 'Object' - 'object name'
        'vadrObject Focus' - position of the user
            'Focus'
            Filter 'Object' - 'object name'

*/