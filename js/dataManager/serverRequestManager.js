import superagent from 'superagent/superagent';
// import pouchDb from 'pouchdb-browser';
import logger from '../logger';
import config from '../config';
import constants from '../constants';
import device from '../deviceData';


/**
 * @module ServerRequestManager
 * @description Manages creating full request dictionaries, adding them to db, 
 * And retreving them to make post calls to server
 */

// const vadrDb = new pouchDb('vadrAnalyticsDb');
const dataRequests = [];
let requestingPost = false;
let failedRequestTimeout = null;

/**
 * Adds request to send data in list of requests
 * @memberof ServerRequestManager
 * @param {object} requestDict The dictionary contaning data for the added request 
 */
function addDataRequest(requestDict){

    logger.info('Request to send data to server');

    const dataRequest = _getServerRequest(requestDict);
    logger.debug('Request data is \n', dataRequest);
    _addRequestToDb(dataRequest).then(() => {

        if (!requestingPost)
            _makeRequestToServer();

    });

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

    return new Promise((resolve, reject) => {

        dataRequests.push(dataRequest);
        resolve();
        // reject("failure reason"); // rejected

    });

}

function _getRequestFromDb(){

    return new Promise((resolve, reject) => {

        if (dataRequests.length >= 1){

            const lruData = dataRequests.shift();
            resolve(lruData);

        } else{
            
            reject();

        }

    });

}

function _makeRequestToServer(){

    requestingPost = true;
    _getRequestFromDb().then((request_data) => {

        console.log('making request to server', request_data);

        superagent.post(constants.requestUrl)
            .send(request_data)
            .then((hello) => {

                console.log('server said ', hello);
                _makeRequestToServer();

            })
            .catch(function(error){
                
                console.log('server error ', error);
                _makeRequestToServer();
                // requestingPost = false;
                // _addRequestToDb(request_data).then(() => {

                //     failedRequestTimeout = setTimeout(() => {
    
                //         if (!requestingPost){
    
                //             _makeRequestToServer();
    
                //         }
                    
                //     }, 10000);

                // });

            });
        _makeRequestToServer();

    }).catch(() => {

        requestingPost = false;

    });

}

export default {
    addDataRequest,
    destroy
};