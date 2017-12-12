import deviceData from './deviceData';
/**
 * @module User
 * @description Stores the user information such as user id and other details such as 
 * age, gender etc.
 * Until userId id is set, device id is used in its place.
 */

let userId = '';
let extraInfo = {};

/**
 * Set user id
 * @memberof User
 * @param {string} newUserId userId of the user
 * @param {boolean} override override any existing userId
 */
function setUserId(newUserId, override){

    if (override || userId == ''){

        userId = newUserId;

    }

}

/**
 * Used to set any extra user information such as age, gender etc.
 * @memberof User
 * @param {string} infoKey name of the paramter being set
 * @param {string} infoValue value of the parameter
 */
function setExtraInfo(infoKey, infoValue){

    extraInfo[infoKey.toString()] = infoValue.toString();

}

/**
 * Used to get all the user details in a dictionary format
 * @memberof User
 * @returns {dictionary} dictionary 
 */
function getUserDictionary(){
    
    const userDict = {};

    if (userId == ''){

        userDict['userId'] = deviceData.getDeviceId();

    } else {

        userDict['userId'] = userId;

    }

    for (let key in extraInfo){
        
        userDict[key] = extraInfo[key];
    
    }

    return userDict;

}

export default {
    setUserId,
    setExtraInfo,
    getUserDictionary
};