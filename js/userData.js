/**
 * Stores the user information such as user id and other details such as age, gender etc.
 * UserId can be set anytime after initialization.
 * @param {string} userId User id   
 */
class User{

    constructor(userId){

        this.userId = '';
        this.extraInfo = {};

        if (userId)
            this.setUserId(userId);

    }

    /**
     * Sets the user id of the user. 
     * @param {string} userId user id
     * @param {boolean} override determines whether to override the existing userId. 
     */
    setUserId(userId, override){

        if (override || this.userId == '')
            this.userId = userId.toString();

    }

    /**
     * Used to set any extra user information such as age, gender etc.
     * @param {string} infoKey name of the paramter being set
     * @param {string} infoValue value of the parameter
     */
    setExtraInfo(infoKey, infoValue){

        this.extraInfo[infoKey.toString()] = infoValue.toString();

    }

    /**
     * Used to test whether the user details set are valid or not
     * @returns {boolean} false if the user id is not set. Else returns true.
     */
    validate(){

        if (this.userId == '')
            return false;
        else 
            return true;

    }

    /**
     * Used to get all the user details in a dictionary format
     * @returns {dictionary} dictionary 
     */
    getUserDictionary(){
        
        const userDict = {};
        userDict['userId'] = this.userId;

        for (let key in this.extraInfo){
            
            userDict[key] = this.extraInfo[key];
        
        }

        return userDict;

    }

}

export {User};