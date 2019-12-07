import models from '../models';
import threadResource from '../resources/thread';

import { hashPass, comparePass } from '../services/hashPassword';

/*
  Get entire thread
  req.query { thread_id }
  resp: { ...thread[-reported, -delete_password] }
 */
const index = async (req, res, next) => {
  try {
    const { thread_id } = req.query;
    const thread = await models.Thread.findById(thread_id).populate('replies');
    if (!thread) throw 'Invalid thread id.';

    return res.json(await threadResource(thread));
  } catch (error) {
    return res.status(400).json(error.message || error);
  }
};

/*
  Reply to thread
  req.body { thread_id, text, delete_password }
*/
const store = async (req, res, next) => {
  try {
    const slug = req.params.board;
    const board = await models.Board.bySlug(slug);
    if (!board) throw 'Invalid board slug';

    const { thread_id, text } = req.body;
    let { delete_password } = req.body;

    const thread = await models.Thread.findById(thread_id);
    if (!thread) throw 'Invalid thread id.';

    if (text.length < 6) throw 'Reply message text is required and must be at least 6 characters.';
    if (delete_password.length < 6) throw 'Reply message deletePassword is required and must be at least 6 characters.';

    delete_password = await hashPass(delete_password);
    const reply = await models.Reply.create({ text, delete_password, thread: thread.id });
    const threadUpdated = await models.Thread.findByIdAndUpdate(thread._id, { replies: [...thread.replies, reply] }, { new: true });

    if( ! req.is('json') ) res.redirect(`/b/${board.slug}/${thread.id}`);
    
    const data = await threadResource(threadUpdated);
    return res.json(data);
  } catch (error) {
    return res.status(400).json(error.message || error);
  }
};

/*
  Report reply
  req.body { thread_id, reply_id }
  action set reply.reported to true
  resp: 'success'
 */
const report = async (req, res, next) => {
  try {
    const slug = req.params.board;
    const board = await models.Board.bySlug(slug);
    if (!board) throw 'Invalid board slug';

    const { thread_id, reply_id } = req.body;
    const r = await models.Reply.findByIdAndUpdate(reply_id, { reported: true }, { new: true });
    if (!r) throw 'Invalid reply id.';

    return res.json('success');
  } catch (error) {
    return res.status(400).json(error.message || error);
  }
};

/*
  Delete reply
  req.body { thread_id, reply_id, delete_password }
  action: set reply.text to '[deleted]'
  resp: 'incorrect password' | 'success'
 */
const destroy = async (req, res, next) => {
  try {
    const slug = req.params.board;
    const board = await models.Board.bySlug(slug);
    if (!board) throw 'Invalid board slug';

    const { thread_id, reply_id, delete_password } = req.body;
    const reply = await models.Reply.findById(reply_id);
    if (!reply) throw 'Invalid reply id.';

    const validPassword = await comparePass(delete_password, reply.delete_password);
    if (!validPassword) throw 'Not authorized.';

    const r = await reply.update({ text: '[deleted]' }, { new: true });

    return res.json('success');
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
