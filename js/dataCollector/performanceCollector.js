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

event= [{
    'name': 'FPS',
    'status': true,
    'callback': null
},
{
    'name': 'CPU Usage',
    'status': false,
    'callback': null
},
{
    'name': 'Memory ResidentUsage',
    'status': false,
    'callback': null
},
{
    'name': 'Memory SwapUsage',
    'status': false,
    'callback': null
}];

function getEvents(){

}

function getMediaEvents(){

}

export default {
    getEvents,
    getMediaEvents
};