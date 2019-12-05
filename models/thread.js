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

ThreadSchema.pre('remove', function(next) {
  this.model('Reply').deleteMany({ thread: this._id }, next);
});

export default mongoose.model('Thread', ThreadSchema);