import models from '../models';
import threadResource from '../resources/thread';

/*
  Get entire thread
  req.query { thread_id }
  resp: { ...thread[-reported, -delete_password] }
 */
const index = async (req, res, next) => {
  try {
    const { thread_id } = req.query;
    const thread = await models.Thread.findById(thread_id);
    if (!thread) throw 'Invalid thread id.';

    return res.json(await threadResource(thread));
  } catch (error) {
    next(error);
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

    const { thread_id, text, delete_password } = req.body;

    const thread = await models.Thread.findById(thread_id);
    if (!thread) throw 'Invalid thread id.';

    if (text.length < 6) throw 'Reply message text is required and must be at least 6 characters.';
    if (delete_password.length < 6) throw 'Reply message deletePassword is required and must be at least 6 characters.';

    const reply = await models.Reply.create({ text, delete_password, thread: thread.id });
    await thread.update({ replies: [...thread.replies, reply] });

    return req.xhr ? res.redirect(`/api/threads/${board.slug}/?thread=${thread.id}`) : res.redirect(`/b/${board.slug}/${thread.id}`);
  } catch (error) {
    next(error);
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
    next(error);
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
    if( reply.delete_password !== delete_password ) throw 'Not authorized.';
    
    const r = await reply.update({ text: '[deleted]' }, { new: true });

    return res.json('success');
    
  } catch (error) {
    next(error);
  }
};

export default {
  index,
  store,
  report,
  destroy,
};
