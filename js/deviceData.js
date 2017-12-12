const deviceInfo = {
    'deviceId': '',
    'language': '',
    'os': '',
    'osv': '',
    'deviceModel': '',
    'cpu': {
        'cpuModel': '',
        'cores': 0,
        'clockFreq': 0
    },
    'gpu': {
        'gpuModel': '',
        'cores': 0,
        'clockFreq': 0,
        'memory': 0
    },
    'ram': {
        'ramType': '',
        'clockFreq': 0,
        'memory': 0
    }
};

/**
 * Returns the deviceId of the device
 * @returns {string} deviceId 
 */
function getDeviceId(){

    return deviceInfo['deviceId'];

}

const registerTime = null;

export default {
    getDeviceId
};

/*
    Tests
    device information can be changed anytime during user, should be updated accordingly

*/