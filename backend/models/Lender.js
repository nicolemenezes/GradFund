const mongoose = require('mongoose');

const lenderSchema = new mongoose.Schema(
  {
    lenderName: {
      type: String,
      required: [true, 'Lender name is required'],
      trim: true
    },
    loanType: {
      type: String,
      required: [true, 'Loan type is required'],
      enum: ['Collateral', 'Non-collateral']
    },
    interestRate: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Interest rate is required']
    },
    conditionNote: {
      type: String,
      default: ''
    },
    minCibilScore: {
      type: Number,
      default: 650
    },
    requiredDocuments: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Lender', lenderSchema);
