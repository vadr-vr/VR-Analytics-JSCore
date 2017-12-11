const assert = require('assert');
import utils from '../js/utils';
import timeManager from '../js/timeManager';
import mediaSession from '../js/dataManager/mediaSession';

function mediaSessionTest(){

    describe('Media session tests', function(){

        
        describe('Video Session', function(){
            
            let sessionWithUrl = null;
            let sessionWithoutUrl = null;
            
            beforeEach(function(){
                
                // initiate time manager, initial media session
                const unixFrameTime = utils.getUnixTimeInMilliseconds();
                timeManager.setApplicationTimes(unixFrameTime, false, false);
    
                // initial scene Session
                sessionWithoutUrl = new mediaSession('test', 'Test media', 1, 0, null);
                sessionWithUrl = new mediaSession('test', 'Test media', 1, 0, 'http://www.vadr.io');
    
            });

        });

    });

}

export default mediaSessionTest;