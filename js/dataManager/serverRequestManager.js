import logger from '../logger';
/**
 * @module ServerRequestManager
 */

/**
 * Adds request to send data in list of requests
 * @memberof ServerRequestManager
 * @param {object} requestDict The dictionary contaning data for the added request 
 */
function addDataRequest(requestDict){

    logger.info('Request to send data to server');
    logger.debug('Request data is \n', requestDict);

}

export default {
    addDataRequest
};