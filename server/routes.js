const express = require('express');
const { randomUUID } = require('crypto');
const mongoose = require('mongoose');
const { Conversation, Inquiry } = require('./models');
const router = express.Router();
const ready = () => mongoose.connection.readyState === 1;

const refusal = "I'm Cynbit Assistant. I can help with information about Cynbit Technologies, its products, services, and business solutions. I cannot assist with unrelated questions, but I'd be happy to help you explore what Cynbit offers.";
const unknown = "I don’t have verified information about that yet. Please contact opportunities@cynbit.in and the Cynbit team can help.";
function companyAnswer(question) {
  const q = question.toLowerCase();
  if (/\b(python|program|coding help|write code|math|calculate|politic|movie|recipe|weather|joke|homework)\b/.test(q)) return refusal;
  if (/\b(contact|email|phone|call|address|located|location|reach)\b/.test(q)) {
    return "You can reach Cynbit at opportunities@cynbit.in or support@cynbit.in. The office is at 32/115 Pratap Nagar, Jaipur, Rajasthan 302033. Phone: +91 89479 62667 or +91 78912 09777.";
  }
  if (/\b(tenant.?ease|property management|tenants?|rent collection)\b/.test(q)) {
    return "TenantEase is Cynbit’s property and tenant management platform. It brings unit tracking, tenant profiles, rent and payment records, reminders, and business dashboards together.";
  }
  if (/\b(revio|reviews?|reputation|sentiment)\b/.test(q)) {
    return "Revio is Cynbit’s AI-assisted review and reputation platform. It supports review syncing, response generation, sentiment analysis, crisis detection, and multi-location controls.";
  }
  if (/\b(cynbit studio|coding platform|career growth|learning platform|developer training)\b/.test(q)) {
    return "Cynbit Studio is an AI-powered learning and career growth platform for developers, with adaptive coding paths, AI-evaluated missions, code feedback, mentor support, mock interviews, resume tools, and job matching.";
  }
  if (/\b(bitelevate|training|learn|mentorship|certification)\b/.test(q)) {
    return "BitElevate is Cynbit’s technical learning initiative. The company describes mentorship, industry projects, career support, and global certification. Contact Cynbit for current enrollment details.";
  }
  if (/\b(different|unique|advantage|why choose|why cynbit|approach|values)\b/.test(q)) {
    return "Cynbit describes its approach as AI-first thinking, end-to-end ownership from design through deployment, startup speed with enterprise rigor, and engineering focused on business outcomes.";
  }
  if (/\b(mission|vision)\b/.test(q)) {
    return "Cynbit’s mission is to build scalable, autonomous ecosystems that simplify complexity. Its vision is to engineer resilient digital infrastructure with technical precision and human warmth.";
  }
  if (/\b(product|products|studio|tenant|revio|platform|saas)\b/.test(q)) {
    return "Cynbit’s product suite includes Cynbit Studio for developer learning and career growth, TenantEase for property and tenant operations, and Revio for review and reputation management.";
  }
  if (/\b(service|services|what do you do|what does cynbit do|company|about cynbit|automation|software|cloud|seo|marketing|ai agent)\b/.test(q)) {
    return "Cynbit Technologies builds AI automation and autonomous agents, custom web and mobile software, cloud systems, legacy modernization, and digital growth services such as technical SEO and CRM automation. It is based in Jaipur, India.";
  }
  if (/\b(cynbit|your company|your services|your products|you offer|you do)\b/.test(q)) return unknown;
  return refusal;
}

router.get('/health', (_req, res) => res.json({ ok: true, database: ready(), assistantConfigured: true, mode: 'instant-faq' }));
router.post('/inquiries', async (req, res) => {
  const { name, email, company = '', message } = req.body || {};
  if (!name || !/^\\S+@\\S+\\.\\S+$/.test(email || '') || !message || String(message).length > 3000) return res.status(400).json({ error: 'Please provide a valid name, email and message.' });
  if (!ready()) return res.status(503).json({ error: 'The inquiry form is temporarily unavailable. Please email opportunities@cynbit.in.' });
  try { await Inquiry.create({ name, email, company, message }); return res.status(201).json({ ok: true }); }
  catch { return res.status(500).json({ error: 'Could not save your inquiry. Please try again.' }); }
});
router.post('/chat', async (req, res) => {
  const { messages, sessionId } = req.body || {};
  if (!Array.isArray(messages) || !messages.length || messages.length > 20) return res.status(400).json({ error: 'Please send a valid message.' });
  const latest = messages[messages.length - 1];
  if (!latest || latest.role !== 'user' || typeof latest.content !== 'string' || latest.content.length > 2000) return res.status(400).json({ error: 'Message is invalid or too long.' });
  if (messages.some((item) => !item || !['user', 'assistant'].includes(item.role) || typeof item.content !== 'string' || item.content.length > 3000)) return res.status(400).json({ error: 'Conversation history is invalid.' });
  const answer = companyAnswer(latest.content);
  if (ready() && typeof sessionId === 'string' && sessionId.length < 80) {
    const id = sessionId || randomUUID();
    try {
      await Conversation.findOneAndUpdate({ sessionId: id }, { $push: { messages: { $each: [{ role: 'user', content: latest.content }, { role: 'assistant', content: answer }], $slice: -40 } } }, { upsert: true, new: true });
      return res.json({ answer, sessionId: id });
    } catch { /* Answer remains available if history storage is temporarily unavailable. */ }
  }
  return res.json({ answer });
});
module.exports = router;
