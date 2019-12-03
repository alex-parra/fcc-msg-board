'use strict';

import models from '../models';

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    
    /*
      Get 10 threads by bumped_on each with 3 most recent replies
      resp: [{ ...thread[-reported, -delete_password] }]
     */
    .get(async (req, res) => {
      const slug = req.params.board;
      const board = await models.Board.bySlug(slug);
      return res.json(board.threads);
    })
  
    /*
      Add message to board
      req.body { text, delete_password }
      redirect to board
     */
    .post(async (req, res) => {
      const slug = req.params.board;
      const { text, delete_password } = req.body;
      
      const board = await models.Board.bySlug(slug);
      const thread = await models.Thread.create({ text, delete_password, board: board.id });
      board.threads.push(thread);
      await board.save();

      return res.redirect(`/b/${board.slug}/`);
    })
  
    
    /*
      Report thread
      req.body { thread_id }
      action set thread.reported to true
      resp: 'success'
     */
    //.put()
  
  
    /*
      Delete Thread
      req.body { thread_id, delete_password }
      action: destroy thread
      resp: 'incorrect password' | 'success'
     */
    //.delete()
    
  app.route('/api/replies/:board')
    
    /*
      Get entire thread
      req.query { thread_id }
      resp: { ...thread[-reported, -delete_password] }
     */
    //.get()
  
    /*
      Reply to thread
      req.body { thread_id, text, delete_password }
    */
    //.post()
  
    
    /*
      Report reply
      req.body { thread_id, reply_id }
      action set reply.reported to true
      resp: 'success'
     */
    //.put()
  
    
    /*
      Delete reply
      req.body { thread_id, reply_id, delete_password }
      action: set reply.text to '[deleted]'
      resp: 'incorrect password' | 'success'
     */
    //.delete()

};
