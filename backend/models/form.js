const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  questionText: { type: String, required: true },
  questionType: {
    type: String,
    enum: ['text', 'radio', 'checkbox', 'rating'],
    required: true
  },
  options: [String],
});

const FormSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  adminId: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  questions: [QuestionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Form', FormSchema);