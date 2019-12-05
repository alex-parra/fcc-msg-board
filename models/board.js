import mongoose from 'mongoose';

const BoardSchema = new mongoose.Schema({
  slug: { type: String, required: true, },
  title: { type: String, required: true, },
  threads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thread' }],
}, {
  timestamps: true,
});

BoardSchema.statics.bySlug = function(slug, upsert = false) {
  const titleFromSlug = slug[0].toUpperCase() + slug.substring(1);
  return this.findOneAndUpdate({slug}, {title: titleFromSlug}, {upsert, new: true, setDefaultsOnInsert: true});
}

BoardSchema.pre('remove', function(next) {
  this.model('Thread').deleteMany({ board: this._id }, next);
});

export default mongoose.model('Board', BoardSchema);