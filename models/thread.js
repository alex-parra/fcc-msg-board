import mongoose from 'mongoose';

// _id, text, created_on(date&time), bumped_on(date&time, starts same as created_on), reported(boolean), delete_password, replies(array)
const ThreadSchema = new mongoose.Schema({
  text: { type: String, required: true, },
  reported: { type: Boolean, },
  delete_password: { type: String, },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }],
}, {
  timestamps: true,
});

ThreadSchema.pre('remove', function(next) {
  this.model('Reply').deleteMany({ thread: this._id }, next);
});

export default mongoose.model('Thread', ThreadSchema);