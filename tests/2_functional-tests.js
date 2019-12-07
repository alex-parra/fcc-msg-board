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
  return chai
    .request(server)
    .post('/api/threads/general')
    .send(testThread);
};

const createTestReply = threadId => {
  return chai
    .request(server)
    .post('/api/replies/general')
    .send({ thread_id: threadId, text: 'Some reply', delete_password: 'myUnguessablePassword' });
};

suite('Functional Tests', function() {
  this.timeout(5000);

  suite('API ROUTING FOR /api/threads/:board', function() {
    suite('POST', function() {
      test('Create new thread with VALID data', async function() {
        const testThread = { text: 'Test Thread', delete_password: 'youWillNeverGuessIt' };
        const res = await chai
          .request(server)
          .post('/api/threads/general')
          .send(testThread);
        assert.equal(res.status, 200);
        assert.property(res.body, '_id');
      });

      test('Create new thread with INVALID text', async function() {
        const testThread = { text: 'Test', delete_password: 'youWillNeverGuessIt' };
        const res = await chai
          .request(server)
          .post('/api/threads/general')
          .send(testThread);
        assert.equal(res.status, 400);
        assert.equal(res.body, 'Thread message text is required and must be at least 6 characters.');
      });

      test('Create new thread with INVALID password', async function() {
        const testThread = { text: 'Test Thread', delete_password: 'you' };
        const res = await chai
          .request(server)
          .post('/api/threads/general')
          .send(testThread);
        assert.equal(res.status, 400);
        assert.equal(res.body, 'Thread message deletePassword is required and must be at least 6 characters.');
      });
    });

    suite('GET', function() {
      test('Non existing board fails as expected', async function() {
        const res = await chai.request(server).get('/api/threads/non-existing-board');
        assert.equal(res.status, 400);
        assert.equal(res.body, 'Unknown board');
      });

      test('Get board threads', async function() {
        const { body: thread } = await createTestThread();
        const res = await chai.request(server).get('/api/threads/general');
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

    suite('DELETE', function() {
      test('Delete a thread with VALID password', async function() {
        const { body: thread } = await createTestThread();
        const payload = { thread_id: thread._id, delete_password: 'youWillNeverGuessIt' };
        const res = await chai
          .request(server)
          .delete('/api/threads/general')
          .send(payload);
        assert.equal(res.status, 200);
        assert.equal(res.text, 'success');
      });

      test('Delete a thread with INVALID password', async function() {
        const { body: thread } = await createTestThread();
        const payload = { thread_id: thread._id, delete_password: 'notTheSamePassword' };
        const res = await chai
          .request(server)
          .delete('/api/threads/general')
          .send(payload);
        assert.equal(res.status, 400);
        assert.equal(res.text, 'incorrect password');
      });
    });

    suite('PUT', function() {
      test('Report a thread', async function() {
        const { body: thread } = await createTestThread();
        const payload = { thread_id: thread._id };
        const res = await chai
          .request(server)
          .put('/api/threads/general')
          .send(payload);
        assert.equal(res.status, 200);
        assert.equal(res.text, 'success');
      });
    });
  });

  suite('API ROUTING FOR /api/replies/:board', function() {
    suite('POST', function() {
      test('Reply to a thread', async function() {
        const { body: thread } = await createTestThread();
        const payload = { thread_id: thread._id, text: 'Some reply', delete_password: 'myUnguessablePassword' };
        const res = await chai
          .request(server)
          .post('/api/replies/general')
          .send(payload);
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, '_id');
        assert.notProperty(res.body, 'delete_password');
        assert.notProperty(res.body, 'reported');
        assert.isArray(res.body.replies);
        assert.isAtLeast(res.body.replies.length, 1);
      });
    });

    suite('GET', function() {
      test('Get full thread', async function() {
        const { body: thread } = await createTestThread();
        const { body: reply } = await createTestReply(thread._id);
        const query = { thread_id: thread._id };
        const res = await chai
          .request(server)
          .get('/api/replies/general')
          .query(query);
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, '_id');
        assert.notProperty(res.body, 'reported');
        assert.notProperty(res.body, 'delete_password');
        assert.isArray(res.body.replies);
        assert.equal(res.body.replies.length, 1);
      });
    });

    suite('PUT', function() {
      test('Report a reply', async function() {
        const { body: thread } = await createTestThread();
        const { body: reply } = await createTestReply(thread._id);
        const payload = { thread_id: thread._id, reply_id: reply._id };
        const res = await chai
          .request(server)
          .put('/api/replies/general')
          .send(payload);
        assert.equal(res.status, 200);
        assert.equal(res.body, 'success');
      });
    });

    suite('DELETE', function() {
      test('Delete a reply', async function() {
        const { body: thread } = await createTestThread();
        const { body: reply } = await createTestReply(thread._id);
        const payload = { thread_id: thread._id, reply_id: reply._id, delete_password: 'myUnguessablePassword' };
        const res = await chai
          .request(server)
          .delete('/api/replies/general')
          .send(payload);
        assert.equal(res.status, 200);
        assert.equal(res.body, 'success');
      });
    });
  });
});
