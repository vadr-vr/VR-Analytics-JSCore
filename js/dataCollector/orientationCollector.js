import timeManager from '../timeManager';
/**
 * @module OrientationCollector
 * @description Calculates the position and other eevnts associated with position data
 */

//TODO
// Orientation - user position
// 'vadrPosition'
// 'vadrMedia Position'
//     for both
//     'Time'
//     'Velocity X'
//     'Velocity Y'
//     'Velocity Z'


let positionCallback = null;

/**
 * Sets the position callback
 * @memberof OrientationCollector
 */
function setPositionCallback(newPositionCallback){

    positionCallback = newPositionCallback;

}

/**
 * returns array of all the position related events with extra info and filters
 * @memberof OrientationCollector
 * @returns event with with extra key info dict
 */
function getEvents(){

    if (positionCallback == null){
        return [];
    }

    let position = positionCallback();

    const extra = {
        'ik': ['time'],
        'iv': [timeManager.getFrameDuration()],
        'fk': [],
        'fv': []
    };

    return [['vadrPosition', position, extra]];

}

function getMediaEvents(){

    return [];

}



export default {
    setPositionCallback,
    getEvents,
    getMediaEvents
};