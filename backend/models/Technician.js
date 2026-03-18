const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skillSet: [{ type: String }], // e.g. ['hardware', 'network', 'software']
    availabilityStatus: {
      type: String,
      enum: ['available', 'busy', 'offline'],
      default: 'available',
    },
    contactNumber: { type: String, trim: true },
    assignedTickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Technician', technicianSchema);
