var assert = require('assert');
import User from '../js/userData.js';

function userDataTests(){
    
    describe('UserData Test', function() {
        
        describe('Initialization test', function() {
            
            const user1 = new User();
            const user2 = new User('abhishek');

            it('Should not set any user id if not given during init', function() {
            
                assert.equal(user1.userId, '');
            
            });
        
            it('Should set user id if given during init', function() {
                
                assert.equal(user2.userId, 'abhishek');
                
            });

            it('Should create empty extraInfo dictionary', function() {
                
                const extraInfo = user1.extraInfo;
                assert.equal(Object.keys(extraInfo).length, 0);
                
            });

            it('Should not validate if user id not present', function() {
                
                assert.equal(user1.validate(), false, 'assert 1');
                
            });
            
            it('Should validate if user id present', function() {
                
                assert.equal(user2.validate(), true, 'assert 2');
                
            });

        });

        describe('Adding userId', function(){
            
            it('Should set user id if none set', function(){

                const user1 = new User();
                user1.setUserId('abhishek');
                assert.equal(user1.userId, 'abhishek');

            });

            it('Should override existing user id if override flag is true', function(){
                
                const user1 = new User();
                user1.setUserId('abhishek');
                user1.setUserId('shubham', true);

                assert.equal(user1.userId, 'shubham');

            });

            it('Should not override existing user id when override flag is false', function(){
                
                const user1 = new User();
                user1.setUserId('abhishek');
                user1.setUserId('shubham', false);

                assert.equal(user1.userId, 'abhishek');

            });    

            it('Should override initialized user id if override flag is true', function(){
                
                const user2 = new User('abhishek');
                user2.setUserId('shubham', true);

                assert.equal(user2.userId, 'shubham');

            });

            it('Should not override initialized user id if override flag is false', function(){
                
                const user2 = new User('abhishek');
                user2.setUserId('shubham', false);

                assert.equal(user2.userId, 'abhishek');

            });
                        
        });

        describe('Adding extra info Test', function(){

            const user1 = new User('abhishek');
            user1.setExtraInfo('age', '25');

            it('Should have the set key in extra info ', function() {
                
                assert('age' in user1.extraInfo);
                assert.equal(user1.extraInfo['age'], '25');
                
            });

        });

        describe('Checking user info dict', function(){

            const user1 = new User('abhishek');
            user1.setExtraInfo('age', '25');            

            it('should return correct user info dictionary', function(){

                const userDict = user1.getUserDictionary();

                assert.equal(Object.keys(userDict).length, 2);
                assert.equal(userDict['userId'], 'abhishek');
                assert.equal(userDict['age'], '25');

            });

        });

    });
    
}

export default userDataTests;