import models from '../models';
import threadResource from '../resources/thread';

import { hashPass, comparePass } from '../services/hashPassword';

/*
  Get 10 threads by bumped_on each with 3 most recent replies
  resp: [{ ...thread[-reported, -delete_password] }]
 */
const index = async (req, res) => {  
  try {
    const slug = req.params.board;
    const board = await models.Board.bySlug(slug).populate({path: 'threads', populate: { path: 'replies'}});
    if( !board ) throw 'Unknown board';
    
    const threads = await threadResource(board.threads);
    
    return res.json(threads);
  } catch( error ) {
    return res.status(400).json(error.message || error);
  }
};

/*
  Add message to board
  req.body { text, delete_password }
  redirect to board
 */
const store = async (req, res, next) => {
  try {
    const slug = req.params.board;

    if (slug.length < 2) throw 'Board slug must be at least 2 characters.';
    if (/[^\w\d]/.test(slug)) throw 'Board slug has invalid characters.';

    let { text, delete_password } = req.body;

    if (text.length < 6) throw 'Thread message text is required and must be at least 6 characters.';
    if (delete_password.length < 6) throw 'Thread message deletePassword is required and must be at least 6 characters.';

    delete_password = await hashPass(delete_password);
    const board = await models.Board.bySlug(slug, true);
    const thread = await models.Thread.create({ text, delete_password, board: board.id });
    await board.update({ threads: [...board.threads, thread] });
    
    if( ! req.is('json') ) return res.redirect(`/b/${board.slug}/`);

    const data = await threadResource(thread);
    return res.json(data);
    
  } catch (error) {
    return res.status(400).json(error.message || error);
  }
};

/*
  Report thread
  req.body { thread_id }
  action set thread.reported to true
  resp: 'success'
 */
const report = async (req, res, next) => {
  try {
    const { thread_id } = req.body;
    if (!thread_id) throw 'Thread id is required.';

    const r = await models.Thread.findByIdAndUpdate(thread_id, { reported: true }, { new: true });
    if (!r) throw 'Invalid thread id.';

    return res.send('success');
  } catch (error) {
    return res.status(400).json(error.message || error);
  }
};

/*
  Delete Thread
  req.body { thread_id, delete_password }
  action: destroy thread
  resp: 'incorrect password' | 'success'
 */
const destroy = async (req, res, next) => {
  try {
    const slug = req.params.board;
    const board = await models.Board.bySlug(slug);
    if (!board) throw 'Invalid board slug';

    const { thread_id, delete_password } = req.body;
    if (!thread_id || !delete_password) throw 'Thread id/password is required.';

    const thread = await models.Thread.findById(thread_id);
    if (!thread) throw 'Invalid thread id.';

    const validPassword = await comparePass(delete_password, thread.delete_password);
    if (!validPassword) return res.status(400).send('incorrect password');

    const r = await thread.remove();

    return res.send('success');
  } catch (error) {
    return res.status(400).json(error.message || error);
  }
};

export default {
  index,
  store,
  report,
  destroy,
};
