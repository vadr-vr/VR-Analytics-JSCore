import orientationCollector from './orientationCollector';
//TODO
// Performance - user position
// 'vadrPerformance'
//     'FPS'
//     'Cpu Usage'
//     'Memory ResidentUsage'
//     'Memory SwapUsage'

// Track Objects
// 'vadrObject Gaze' - position is the intersect of raycast on object
//     'Time'
//     Filter 'Object' - 'object name'
// 'vadrObject Focus' - position of the user
//     'Focus'
//     Filter 'Object' - 'object name'

// const eventsDict= [{
//     'name': 'FPS',
//     'status': true,
//     'callback': null
// }];

let framesTillNow = 0;

function _getEvents(duration){

    const currentPosition = orientationCollector.getCurrentPosition();

    if (!currentPosition)
        return [];

    let fps = parseInt(1000 * framesTillNow / duration);
    framesTillNow = 0;

    const extra = {
        'ik': ['FPS'],
        'iv': [fps],
        'fk': [],
        'fv': []
    };

    return [['vadrPerformance', orientationCollector.getCurrentPosition(), extra]];

}   

function getEvents(duration){

    return _getEvents(duration);

}

function getMediaEvents(duration){

    return _getEvents(duration);

}

function tick(){

    framesTillNow++;

}

export default {
    getEvents,
    getMediaEvents,
    tick
};