import superagent from 'superagent/superagent';
import logger from '../logger';
import config from '../config';
import constants from '../constants';
import device from '../deviceData';

/**
 * @module ServerRequestManager
 * @description Manages creating full request dictionaries, adding them to db, 
 * And retreving them to make post calls to server
 */

let dataRequests = null;
let requestingPost = false;
let failedRequestTimeout = null;

_getLocalStorage();

/**
 * Adds request to send data in list of requests
 * @memberof ServerRequestManager
 * @param {object} requestDict The dictionary contaning data for the added request 
 */
function addDataRequest(requestDict){

    logger.info('Adding request to server');

    const dataRequest = _getServerRequest(requestDict);

    _addRequestToDb(dataRequest).then(() => {

        if (!requestingPost){

            _makeRequestToServer();

        }

    });

}

function _getLocalStorage(){

    // handles data for applications in a domain, irrespective of id
    const existingData = localStorage.getItem(constants.localStorageKeyName);
    if (existingData)
        dataRequests = JSON.parse(existingData);
    else
        dataRequests = {
            'list': []
        };

    logger.debug('These many existing requests found', dataRequests['list'].length);

}

function _syncToLocalStorage(){

    localStorage.setItem(constants.localStorageKeyName, JSON.stringify(dataRequests));

}

function destroy(){

    if (failedRequestTimeout){

        clearTimeout(failedRequestTimeout);
        failedRequestTimeout = null;
        
    }

}

function _getServerRequest(sessionRequest){

    const dataRequest = {
        appId: config.getApplication.id(),
        appToken: config.getApplication.token(),
        version: config.getApplication.version(),
        device: device.getDeviceInformation(),
        sessions: [sessionRequest]
    };

    return JSON.stringify(dataRequest);

}

function _addRequestToDb(dataRequest){

    return new Promise((resolve) => {

        dataRequests['list'].push(dataRequest);
        _syncToLocalStorage();
        resolve();
        // reject("failure reason"); // rejected

    });

}

function _getRequestFromDb(){

    return new Promise((resolve, reject) => {

        if (dataRequests['list'].length >= 1){

            const lruData = dataRequests['list'].shift();

            _syncToLocalStorage();
            resolve(lruData);

        } else{
            
            reject();

        }

    });

}

function _makeRequestToServer(){


    requestingPost = true;
    _getRequestFromDb().then((request_data) => {

        logger.debug('making request to server');

        superagent.post(constants.getRequestUrl())
            // .set('Content-Type', 'application/json')
            // .responseType('application/json')
            .send(request_data)
            .then(() => {

                _makeRequestToServer();

            })
            .catch((error) => {
                
                logger.debug('Error while uploading data.');

                if (error && error.response && error.response.body && 
                    error.response.body['delete']){

                    _makeRequestToServer();

                } else {

                    requestingPost = false;
                    _addRequestToDb(request_data).then(() => {
    
                        if (failedRequestTimeout){

                            clearTimeout(failedRequestTimeout);

                        }

                        failedRequestTimeout = setTimeout(() => {
        
                            if (!requestingPost){
        
                                _makeRequestToServer();
        
                            }
    
                            failedRequestTimeout = null;
                        
                        }, 10000);
    
                    });

                }

            });

    }).catch(() => {

        requestingPost = false;

    });

}

export default {
    addDataRequest,
    destroy
};