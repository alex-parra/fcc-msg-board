import mongoose from 'mongoose';

// _id, text, created_on, delete_password, reported
const ReplySchema = new mongoose.Schema({
  text: { type: String, required: true, },
  reported: { type: Boolean, default: false, },
  delete_password: { type: String, required: true, },
  thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true, },
}, {
  timestamps: true,
});

export default mongoose.model('Reply', ReplySchema);
