const toPlain = async reply => {
  return {
    _id: reply._id,
    threadId: reply.thread,
    text: reply.text,
    created_on: reply.createdAt,
    bumped_on: reply.updatedAt,
  };
};

export default async data => {
  if (!Array.isArray(data)) return await toPlain(data);
  return await Promise.all(data.map(toPlain));
};
