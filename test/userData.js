import {User} from "../js/userData.js";


function userDataTests(){
    var assert = require('assert');
    describe('Array', function() {
        const hello = "hello";
      describe('#indexOf()', function() {
          const hello1 = "hola";
        it('should return -1 when the value is not present', function() {
            assert.equal(-1, [1,2,3].indexOf(4));
        });
      });
    });
    
}

export {userDataTests};