/**
 * @module ApplicationConfig
 * @description Contains the application specific information such as App id, token, 
 * version, test mode, default information collection frequency etc.
 */

let testMode = false;
let dataPostTimeInterval = 30;
let dataPostMaxEvents = 1000;

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
 * @memberof ApplicationConfig
 * @param {boolean} test set it to true while developing, false when shipping in 
 * production
 */
function setTestMode(test){

    test == !!test;
    testMode = test;

}

/**
 * Returns the test mode value
 * @memberof ApplicationConfig
 * @returns {boolean} testMode
 */
function getTestMode(){

    return testMode;

}

/**
 * Returns the time interval between send data request
 * @memberof ApplicationConfig
 * @returns {number} 
 */
function getDataPostTimeInterval(){

    return dataPostTimeInterval;

}

/**
 * Returns the max number of events after which a request is scheduled to the server
 * @memberof ApplicationConfig
 * @returns {number}
 */
function getMaxEventsNumber(){

    return dataPostMaxEvents;

}

export default {
    setTestMode,
    getTestMode,
    getDataPostTimeInterval,
    getMaxEventsNumber
};

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