const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
  {
    // Student & Study Details
    studentName: {
      type: String,
      default: 'Anonymous Student',
      trim: true
    },
    cibilScore: {
      type: Number,
      default: 700
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true
    },
    university: {
      type: String,
      required: [true, 'University is required'],
      trim: true
    },
    course: {
      type: String,
      required: [true, 'Course is required'],
      trim: true
    },
    tuitionFeesINR: {
      type: Number,
      required: [true, 'Tuition fees (INR) is required'],
      min: 0
    },
    livingCostPerYearINR: {
      type: Number,
      required: [true, 'Living cost per year (INR) is required'],
      min: 0
    },
    durationYears: {
      type: Number,
      required: [true, 'Duration in years is required'],
      min: 1
    },

    // Financial Profile
    familySavingsINR: {
      type: Number,
      default: 0,
      min: 0
    },
    scholarshipsINR: {
      type: Number,
      default: 0,
      min: 0
    },
    feesPaidINR: {
      type: Number,
      default: 0,
      min: 0
    },
    annualIncomeINR: {
      type: Number,
      required: [true, 'Co-applicant annual income (INR) is required'],
      min: 0
    },
    monthlyEMIsINR: {
      type: Number,
      default: 0,
      min: 0
    },

    // Collateral Details
    hasCollateral: {
      type: Boolean,
      required: [true, 'Collateral status is required']
    },
    propertyValueINR: {
      type: Number,
      default: 0,
      min: 0
    },

    // Calculated Results
    totalStudyCostINR: {
      type: Number,
      required: true
    },
    totalFundingGapINR: {
      type: Number,
      required: true
    },
    foirPercentage: {
      type: Number,
      required: true
    },
    // Phase 3: LRS Tax, FOIR Analysis & Document Health
    lrsBreakdown: {
      totalRemittanceINR: Number,
      loanAmountINR: Number,
      savingsAmountINR: Number,
      swiftWireFeeINR: Number,
      forexMarkupPercent: Number,
      forexMarkupINR: Number,
      loanTcsINR: Number,
      savingsTcsINR: Number,
      totalTcsINR: Number,
      trueOutOfPocketINR: Number,
      outflowShockINR: Number
    },
    foirAnalysis: {
      foirPercentage: Number,
      statusBand: String, // GREEN, AMBER, RED
      badgeText: String,
      recommendation: String
    },
    documentHealth: {
      readinessScore: String, // e.g. "4/5"
      scorePercentage: Number,
      warnings: [String],
      checks: [
        {
          id: String,
          name: String,
          status: String, // VERIFIED, WARNING, MISSING
          details: String
        }
      ]
    },
    matchedLenders: [
      {
        lenderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Lender'
        },
        lenderName: String,
        loanType: String,
        interestRate: mongoose.Schema.Types.Mixed,
        conditionNote: String,
        minCibilScore: Number,
        requiredDocuments: [String],
        isEligible: Boolean,
        matchReason: String
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Assessment', assessmentSchema);
