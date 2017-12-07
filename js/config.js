/*
    Contains the configuration for collecting data
*/

const testMode = false;

// 0 - none, 1 - error, 2 - Warning, 3 - Info, 4 - Debug
const logLevel = 4;

const applicationConfig = {
    "appId": "",
    "appToken": "",
    "version": ""
};

const dataConfig = {
    "Gaze": {
        "timePeriod": 200,
        "status": true,
        "events": ["vadrGaze", "vadrMedia Gaze"]
    },
    "Orientation": {
        "timePeriod": 200,
        "status": true,
        "events": ["vadrPosition", "vadrMedia Position"]
    },
    "Performance": {
        "timePeriod": 200,
        "status": true,
        "events": ["FPS", "CPU Usage", "Memory ResidentUsage", "Memory SwapUsage"]
    },
    "TrackObjects": {
        "timePeriod": 200,
        "status": true,
        "events": ["vadrObject Gaze", "vadrObject Focus"]
    }
};


/*
    Gaze - user position
        "vadrGaze"
        "vadrMedia Gaze" - 
            "Status" : "Paused"

    Orientation - user position
        "vadrPosition"
        "vadrMedia Position"
            for both
            "Time"
            "Velocity X"
            "Velocity Y"
            "Velocity Z"

    Performance - user position
        "vadrPerformance"
            "FPS"
            "Cpu Usage"
            "Memory ResidentUsage"
            "Memory SwapUsage"

    Track Objects
        "vadrObject Gaze" - position is the intersect of raycast on object
            "Time"
            Filter "Object" - "object name"
        "vadrObject Focus" - position of the user
            "Focus"
            Filter "Object" - "object name"

*/