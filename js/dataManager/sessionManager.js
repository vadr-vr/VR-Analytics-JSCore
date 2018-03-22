import logger from '../logger';
import constants from '../constants';
import utils from '../utils';
import session from './session';

/**
 * @module SessionManager
 * Handles the creation of restoration of old sessions, session referrer etc.
 */

let currentSession = null;
let sessionReferrer = null;

/**
 * Manages creation of current session.
 * @memberof DataManager
 * @private
 */
function createSession(){

    // can also check if any ealier session can be used
    if (!currentSession){
        
        const createNewSession = _setSessionReferrer();
        const currentSessionCookie = utils.getCookie(constants.sessionCookieName);

        if (currentSessionCookie && !createNewSession){

            const currentSessionSplit = currentSessionCookie.split('__');
            currentSession = new session(currentSessionSplit[0], 
                parseInt(currentSessionSplit[1]), {});
            
            logger.debug('Found existing session', currentSessionSplit[0], 
                currentSessionSplit[1]);

        } else{

            currentSession = new session(null, null, {});
            setSessionCookie();

            logger.debug('Creating new session', currentSession.getSessionToken(), 
                currentSession.getSessionUnixTime());

        }
        
    }

    return currentSession;

}

function setSessionCookie(){

    const currentDate = new Date();
    const laterDate = new Date();
    laterDate.setMinutes(currentDate.getMinutes() + 
        constants.sessionCookieValidForMinutes);
    
    const cookieValueString = currentSession.getSessionToken() + '__' + 
        currentSession.getSessionUnixTime().toString();

    utils.setCookie(constants.sessionCookieName, cookieValueString, laterDate);

    // update the referrer cookie as well
    if(sessionReferrer){

        utils.setCookie(constants.referrerCookieName, sessionReferrer, laterDate);

    }

    logger.debug('Setting session cookie', cookieValueString);

}

// private functions
/**
 * @private
 * @memberof SessionManager
 * return true if a new session is necessary to create because of a change in referrer
 */
function _setSessionReferrer(){

    if (document.referrer){

        sessionReferrer = document.referrer;
        const oldReferrer = utils.getCookie(constants.referrerCookieName);

        return oldReferrer != document.referrer;

    }

}

export default {
    createSession,
    setSessionCookie
};