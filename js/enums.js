/**
 * @module Enums
 * @description contains all the values which can be provided to vadr for configuration
 */

const gender = {
    'unknown': 0,
    'male': 1,
    'femane': 2,
    'other': 3
};

const media360 = {
    'video': 1,
    'image': 2
};

const defaultEvents = {
    'orientation': 'orientation',
    'gaze': 'gaze',
    'performance': 'performance'
};

export default {
    gender,
    media360,
    defaultEvents
};