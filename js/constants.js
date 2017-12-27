/**
 * @module Constants
 * @description Stores SDK specific constants
 */

const deviceCookieName = '_vadrAnalyticsId';
const cookieValidForYears = 3;
const sessionCookieName = '_vadrAnalyticsSessionId';
const sessionCookieValidForMinutes = 30;
const localStorageKeyName = '_vadrDataStorage';
const requestUrl = 'https://vadr.io/analytics/api/v1.1/register/data/';

/**
 * Get the device cookie name
 * @memberof Constants
 */

export default {
    deviceCookieName,
    cookieValidForYears,
    sessionCookieName,
    sessionCookieValidForMinutes,
    requestUrl,
    localStorageKeyName
};