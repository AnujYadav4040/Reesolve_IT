const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['hardware', 'software', 'network', 'access', 'other'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    aiPredictedPriority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed', 'on-hold'],
      default: 'open',
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    technician: { type: mongoose.Schema.Types.ObjectId, ref: 'Technician' },
    attachments: [{ type: String }], // file URLs
    resolvedDate: { type: Date },
    closedDate: { type: Date },
    resolutionNote: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);
