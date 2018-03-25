import timeManager from '../timeManager';
import utils from '../utils';
/**
 * @module GazeCollector
 * @description Calculates the position and other eevnts associated with position data
 */

let gazeCallback = null;
let angleCallback = null;

/**
 * Sets the gaze callback
 * @memberof GazeCollector
 */
function setGazeCallback(newGazeCallback){

    gazeCallback = newGazeCallback;

}

/**
 * Sets the angle callback
 * @memberof GazeCollector
 */
function setAngleCallback(newAngleCallback){

    angleCallback = newAngleCallback;

}

function getAngle(){

    if (angleCallback){

        return angleCallback();

    }

    return null;
}

/**
 * returns array of all the position related events with extra info and filters
 * @memberof GazeCollector
 * @returns event with with extra key info dict
 */
function getEvents(duration){

    if (gazeCallback == null){

        return [];
    
    }

    let gaze = gazeCallback();

    if (!gaze){

        return [];

    }

    const extra = {
        'ik': ['Time'],
        'iv': [utils.getDataPointDuration(duration)],
        'fk': [],
        'fv': []
    };

    return [['vadrGaze', gaze, extra]];

}

function getMediaEvents(duration){

    if (angleCallback == null){
        
        return [];

    }

    let angle = angleCallback();

    if (!angle){

        return [];
        
    }

    const extra = {
        'ik': ['Time'],
        'iv': [utils.getDataPointDuration(duration)],
        'fk': [],
        'fv': []
    };

    if (timeManager.getVideoState() == false){

        extra['fk'].push('Status');
        extra['fv'].push('Paused');
        
    }

    return [['vadrMedia Gaze', angle, extra]];

}

function destroy(){

    gazeCallback = null;
    angleCallback = null;

}

export default {
    setGazeCallback,
    setAngleCallback,
    getAngle,
    getEvents,
    getMediaEvents,
    destroy
};