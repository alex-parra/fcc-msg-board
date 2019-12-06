/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

const createTestThread = () => {
  const testThread = { text: 'Test Thread', delete_password: 'youWillNeverGuessIt' };
  return chai.request(server)
    .post('/api/threads/general')
    .send(testThread);
}

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('Create new thread with VALID data', () => {
        const testThread = { text: 'Test Thread', delete_password: 'youWillNeverGuessIt' };
        return chai.request(server)
          .post('/api/threads/general')
          .send(testThread)
          .then(res => {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id');
          });
      });
      
      test('Create new thread with INVALID text', () => {
        const testThread = { text: 'Test', delete_password: 'youWillNeverGuessIt' };
        return chai.request(server)
          .post('/api/threads/general')
          .send(testThread)
          .then(res => {
            assert.equal(res.status, 400);
            assert.equal(res.body, 'Thread message text is required and must be at least 6 characters.');
          });
      });
      
      test('Create new thread with INVALID password', () => {
        const testThread = { text: 'Test Thread', delete_password: 'you' };
        return chai.request(server)
          .post('/api/threads/general')
          .send(testThread)
          .then(res => {
            assert.equal(res.status, 400);
            assert.equal(res.body, 'Thread message deletePassword is required and must be at least 6 characters.');
          });
      });
      
    });
    
    suite('GET', function() {
      test('Get threads', () => {
        return chai.request(server)
          .get('/api/threads/general')
          .then(res => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], '_id');
            assert.property(res.body[0], 'text');
            assert.property(res.body[0], 'boardId');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'bumped_on');
            assert.isArray(res.body[0].replies);
            assert.isNumber(res.body[0].replycount);
            assert.notProperty(res.body[0], 'delete_password');
            assert.notProperty(res.body[0], 'reported');
          });
      });
      
    });
    
    suite('DELETE', function() {
      test('Delete a thread with VALID password', async () => {
        const res = await createTestThread();
        return chai.request(server)
          .delete('/api/threads/general')
          .send({ thread_id: res.body._id, delete_password: 'youWillNeverGuessIt' })
          .then(res => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
          }); 
      });
      
      test('Delete a thread with INVALID password', async () => {
        const res = await createTestThread();
        return chai.request(server)
          .delete('/api/threads/general')
          .send({ thread_id: res.body._id, delete_password: 'notTheSamePassword' })
          .then(res => {
            assert.equal(res.status, 400);
            assert.equal(res.text, 'incorrect password');
          }); 
      });
    });
    
    suite('PUT', function() {
      test('Report a thread', async () => {
        const res = await createTestThread();
        return chai.request(server)
          .put('/api/threads/general')
          .send({ thread_id: res.body._id })
          .then(res => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'success');
          });
      });
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
    });
    
    suite('GET', function() {
      
    });
    
    suite('PUT', function() {
      
    });
    
    suite('DELETE', function() {
      
    });
    
  });

});
