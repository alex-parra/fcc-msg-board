import replyResource from './reply';

const toPlain = async thread => {
  await thread.populate('replies').execPopulate();
  return {
    _id: thread._id,
    boardId: thread.board,
    text: thread.text,
    replycount: thread.replies.length,
    replies: await replyResource(thread.replies),
    created_on: thread.createdAt,
    bumped_on: thread.updatedAt,
  };
};

export default async data => {
  if (!Array.isArray(data)) return await toPlain(data);
  return await Promise.all(data.map(toPlain));
};
