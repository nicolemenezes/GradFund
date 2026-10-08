const Lender = require('../models/Lender');

const initialLenders = [
  {
    lenderName: 'BOI',
    loanType: 'Collateral',
    interestRate: '9.00% (Girls: 8.60%)',
    conditionNote: '0.40% interest concession for female students. Requires eligible property collateral.',
    minCibilScore: 670,
    requiredDocuments: [
      'Academic Transcripts & Marksheets',
      'Admission Offer Letter',
      'Property Title Deed & Valuation Report',
      'Co-applicant Income Tax Returns (2 Years)',
      'Bank Statements (Last 6 Months)',
      'KYC Documents (PAN, Aadhaar)'
    ]
  },
  {
    lenderName: 'BOB',
    loanType: 'Non-collateral',
    interestRate: '8.45%',
    conditionNote: 'Applicable for Premier / Top 100 global universities. No collateral required.',
    minCibilScore: 700,
    requiredDocuments: [
      'Academic Transcripts & Standardized Test Scores',
      'Admission Letter from Top 100 University',
      'Co-applicant Salary Slips & Form 16',
      'Bank Account Statements (6 Months)',
      'KYC Documents (PAN, Passport)'
    ]
  },
  {
    lenderName: 'BOB',
    loanType: 'Collateral',
    interestRate: '8.95% (Boys) / 8.75% (Girls)',
    conditionNote: '0.20% concession for female students with property collateral.',
    minCibilScore: 700,
    requiredDocuments: [
      'Academic Records',
      'Admission Offer Letter',
      'Property Legal Clearance & Valuation Certificate',
      'Co-applicant Income Proof & ITR',
      'Identity & Address Proofs'
    ]
  },
  {
    lenderName: 'SBI',
    loanType: 'Non-collateral',
    interestRate: '9.40%',
    conditionNote: 'SBI Student Loan Scheme for top-tier listed institutions worldwide.',
    minCibilScore: 750,
    requiredDocuments: [
      'Standard 10th, 12th & Degree Certificates',
      'Official Admission Offer Letter',
      'Co-applicant Salary Slips / Business ITR',
      'Bank Statements (6 Months)',
      'Passport & Aadhaar Card'
    ]
  },
  {
    lenderName: 'SBI',
    loanType: 'Collateral',
    interestRate: '8.40%',
    conditionNote: 'SBI Global Ed-Vantage Scheme with tangible collateral property.',
    minCibilScore: 750,
    requiredDocuments: [
      'Academic Transcripts & GRE/GMAT/IELTS Scores',
      'Admission Letter',
      'Collateral Property Documents & Encumbrance Certificate',
      'Co-applicant Financial Documents',
      'KYC Proofs'
    ]
  },
  {
    lenderName: 'Credila',
    loanType: 'Non-collateral',
    interestRate: '10.75%',
    conditionNote: 'HDFC Credila customized unsecured education loan with doorstep service.',
    minCibilScore: 680,
    requiredDocuments: [
      'Academic Marksheets',
      'University Admission Letter',
      'Co-applicant 3 Months Salary Slips & 2 Years ITR',
      'Bank Statements (6 Months)',
      'PAN & Aadhaar'
    ]
  },
  {
    lenderName: 'Credila',
    loanType: 'Collateral',
    interestRate: '9.25%-9.75%',
    conditionNote: 'HDFC Credila property-backed loan with competitive floating rates.',
    minCibilScore: 680,
    requiredDocuments: [
      'Academic Certificates',
      'Admission Letter',
      'Property Title Deed & Building Plan',
      'Co-applicant Income Statements',
      'KYC Documents'
    ]
  },
  {
    lenderName: 'Auxilo',
    loanType: 'Non-collateral',
    interestRate: '10.25%',
    conditionNote: '100% financing options covering tuition and living expenses for STEM courses.',
    minCibilScore: 670,
    requiredDocuments: [
      'Academic Records & Test Results',
      'Admission Offer Letter',
      'Co-applicant Income Proof & Bank Statements',
      'KYC Documents'
    ]
  },
  {
    lenderName: 'Auxilo',
    loanType: 'Collateral',
    interestRate: '10.00%',
    conditionNote: 'Fast track approval process backed by residential/commercial collateral.',
    minCibilScore: 670,
    requiredDocuments: [
      'Academic Transcripts',
      'Admission Letter',
      'Property Collateral Documents & Valuation Report',
      'Co-applicant Financial Proofs',
      'KYC Proofs'
    ]
  }
];

const seedLenders = async () => {
  try {
    const count = await Lender.countDocuments();
    if (count === 0) {
      await Lender.insertMany(initialLenders);
      console.log('✅ Default lender dataset seeded successfully! (9 records)');
    } else {
      console.log(`ℹ️ Database already has ${count} lender record(s). Skipping seed.`);
    }
  } catch (error) {
    console.error('❌ Error seeding lender data:', error.message);
  }
};

module.exports = { initialLenders, seedLenders };
