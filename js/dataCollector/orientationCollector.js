import timeManager from '../timeManager';
/**
 * @module OrientationCollector
 * @description Calculates the position and other events associated with position data
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
let currentPosition = null;

/**
 * Sets the position callback
 * @memberof OrientationCollector
 * @param {function} newPositionCallback new callback to be used to fetch position
 */
function setPositionCallback(newPositionCallback){

    positionCallback = newPositionCallback;

}

/**
 * returns array of all the position related events with extra info and filters
 * @memberof OrientationCollector
 * @returns {array} event deatails in format [name, position, extraInfo]
 */
function getEvents(){

    if (positionCallback == null){
        return [];
    }

    currentPosition = positionCallback();

    if (!currentPosition){

        return [];
        
    }

    const extra = {
        'ik': ['Time'],
        'iv': [timeManager.getFrameDurationSeconds()],
        'fk': [],
        'fv': []
    };

    return [['vadrPosition', currentPosition, extra]];

}

function getMediaEvents(){

    return [];

}

/**
 * Fetch the position calculated in current frame. 
 * @memberof OrientationCollector
 * @returns {string} currentPosition
 */
function getCurrentPosition(){

    return currentPosition;

}

function destroy(){

    positionCallback = null;

}

export default {
    setPositionCallback,
    getCurrentPosition,
    getEvents,
    getMediaEvents,
    destroy
};