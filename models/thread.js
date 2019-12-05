import mongoose from 'mongoose';

const ThreadSchema = new mongoose.Schema({
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  text: { type: String, required: true, },
  delete_password: { type: String, required: true },
  reported: { type: Boolean, default: false },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }],
}, {
  timestamps: true,
});

ThreadSchema.pre('remove', async function(next) {
  await this.model('Reply').deleteMany({ thread: this._id });
  await this.model('Board').update({_id: this.board}, {$pull: {threads: this._id}});
  return next();
});

export default mongoose.model('Thread', ThreadSchema);