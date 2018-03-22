/**
 * @module Constants
 * @description Stores SDK specific constants
 */

const deviceCookieName = '__vadrAnalyticsId';
const cookieValidForYears = 3;
const referrerCookieName = '__vadrAnalyticsSessionReferrer';
const sessionCookieName = '__vadrAnalyticsSessionId';
const sessionCookieValidForMinutes = 5;
const localStorageKeyName = '__vadrDataStorage';
let requestUrl = 'https://vadr.io/analytics/api/v1.1/register/data/';

const setRequestUrl = (newRequestUrl) => {

    requestUrl = newRequestUrl;

};

const getRequestUrl = () => {

    return requestUrl;

}
/**
 * Get the device cookie name
 * @memberof Constants
 */

export default {
    deviceCookieName,
    cookieValidForYears,
    referrerCookieName,
    sessionCookieName,
    sessionCookieValidForMinutes,
    localStorageKeyName,
    getRequestUrl,
    setRequestUrl
};