const mongoose = require('mongoose');

const approvalRuleSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, unique: true },
    threshold: { type: Number, required: true, min: 0 },
    financeHeadRequired: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ApprovalRule', approvalRuleSchema);
