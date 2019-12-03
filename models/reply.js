import mongoose from 'mongoose';

// _id, text, created_on, delete_password, reported
const ReplySchema = new mongoose.Schema({
  text: { type: String, required: true, },
  reported: { type: Boolean, },
  delete_password: { type: String, },
  thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
}, {
  timestamps: true,
});

export default mongoose.model('Reply', ReplySchema);
