/**
 * @module Constants
 * @description Stores SDK specific constants
 */

const deviceCookieName = '_vadrAnalyticsId';
const cookieValidForYears = 3;
const sessionValidForHours = 1;
// const requestUrl = 'http://dev.vadr.io/analytics/api/v1.1/register/data/';
const requestUrl = 'http://vadr.com:8000/analytics/api/v1.1/register/data/';

/**
 * Get the device cookie name
 * @memberof Constants
 */

export default {
    deviceCookieName,
    cookieValidForYears,
    sessionValidForHours,
    requestUrl
};