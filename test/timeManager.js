var assert = require('assert');
import timeManager from '../js/timeManager';
import utils from '../js/utils';

function timeManagerTests(){

    describe('Time Manager tests', function(){

        const frameUnixTime = utils.getUnixTimeInMilliseconds();
        
        beforeEach(function(){

            timeManager.setApplicationTimes(frameUnixTime, false, false);            

        });

        describe('Application init tests', function(){

            it('Should set the correct initial time parameters', function() {
                
                assert.equal(timeManager.getFrameUnixTime(), frameUnixTime);
                assert.equal(timeManager.getFrameDuration(), 0);
                assert.equal(timeManager.getPlayTimeSinceStart(), 0);
                assert.equal(timeManager.getTimeSinceStart(), 0);
            
            });

        });

        describe('Incrementing time under different conditions', function(){

            const incrementTime = 200; //milliseconds
            const newFrameTime = frameUnixTime + incrementTime;

            afterEach(function(){

                timeManager.reset(frameUnixTime);

            });

            it('Should only set frame unix time if appActive set to false', function(){

                timeManager.setApplicationTimes(newFrameTime, false, false);
                assert.equal(timeManager.getFrameUnixTime(), newFrameTime);
                assert.equal(timeManager.getFrameDuration(), 0);
                assert.equal(timeManager.getPlayTimeSinceStart(), 0);
                assert.equal(timeManager.getTimeSinceStart(), 0);                

            });

            it('Should set frame duration if appActive set to true', function(){

                timeManager.setApplicationTimes(newFrameTime, true, false);
                assert.equal(timeManager.getFrameDuration(), incrementTime);

            });

            it('Should set timeSinceStart if appActive set to true', function(){

                timeManager.setApplicationTimes(newFrameTime, true, false);
                assert.equal(timeManager.getTimeSinceStart(), incrementTime);

            });

            it('Should not set play time since start if appPlaying set to false', function(){
                
                timeManager.setApplicationTimes(newFrameTime, true, false);
                assert.equal(timeManager.getPlayTimeSinceStart(), 0);

            });

            it('Should set play time since start if appPlaying set to true', function(){
                
                timeManager.setApplicationTimes(newFrameTime, true, true);
                assert.equal(timeManager.getPlayTimeSinceStart(), incrementTime);

            });

        });

    });
}

export default timeManagerTests;