/*
*
*
*       FILL IN EACH UNIT TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]----
*       (if additional are added, keep them at the very end!)
*/

var chai = require('chai');
var assert = chai.assert;

import { hashPass, comparePass } from '../services/hashPassword';

suite('Unit Tests', function(){

  describe('services/hashPassword', function() {
    
    it('hashes', async () => {
      const pass = '4n23k4j2kl342';
      const hashed = await hashPass(pass);
      const valid = await comparePass(pass, hashed);
      assert.isTrue(valid);
    });
    
  });
  
});