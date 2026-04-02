const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({ role: { type: String, enum: ['user', 'assistant'], required: true }, content: { type: String, required: true, maxlength: 3000 } }, { timestamps: true });
const conversationSchema = new mongoose.Schema({ sessionId: { type: String, required: true, unique: true }, messages: [messageSchema] }, { timestamps: true });
const inquirySchema = new mongoose.Schema({ name: { type: String, required: true, maxlength: 120 }, email: { type: String, required: true, maxlength: 254 }, company: { type: String, maxlength: 160 }, message: { type: String, required: true, maxlength: 3000 } }, { timestamps: true });
module.exports = { Conversation: mongoose.model('Conversation', conversationSchema), Inquiry: mongoose.model('Inquiry', inquirySchema) };
