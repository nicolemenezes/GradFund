GradFund: Education Loan Assessment & Matching Engine

**GradFund** is a specialized MERN-stack financial assessment and matching engine built for Indian students and families planning higher education abroad. While standard international education tools focus solely on tuition and living expenses, GradFund accounts for the systemic, regulatory, and financial hurdles unique to Indian education financing.

## 🚀 Live Links
- **Frontend App (Vercel): https://grad-fund-kappa.vercel.app/
- **Backend API (Render): https://gradfund-backend.onrender.com/

---
🛠️ Tech Stack
- **Frontend:** React, Vite, Tailwind CSS (styled using GradGuide’s editorial brand design system).
- **Backend:** Node.js, Express.js.
- **Database & Seeding:** MongoDB, Mongoose. Features an automated startup seed script that populates official lender criteria (public banks like SBI, BOB, BOI, and NBFCs like Credila, Auxilo) directly into the database so eligibility rules are queried dynamically rather than hardcoded.

---
 The 3 Unique Differentiator Features

1. **LRS Tax (TCS) & Forex Outflow Shock Calculator**
   - *Problem:* Families budget strictly for tuition/living costs, ignoring India's Liberalized Remittance Scheme (LRS) Tax Collected at Source (TCS) and wire fees, causing a sudden ₹1.5L–₹3L cash crunch before visa filing.
   - *Solution:* Automatically calculates TCS (0.5% for education loans vs. up to 20% for personal funds above ₹7L) alongside SWIFT wire fees to reveal the true out-of-pocket cash required.

2. **Co-Applicant FOIR (Fixed Obligation to Income Ratio) & Debt Stress Analyzer**
   - *Problem:* Indian banks strictly cap parent co-applicant debt ratios (~50% for public banks). Existing home or car loans often trigger unannounced loan rejections.
   - *Solution:* Captures co-applicant income and ongoing monthly EMIs to calculate net FOIR, instantly flagging rejection risks and guiding families toward public banks vs. flexible NBFCs.

3. **Indian Tax & Net Worth Document Health Checker**
   - *Problem:* Loan applications face severe delays due to minor documentation mismatches (e.g., ITR gross income not matching bank statement credits, or CA certificates missing mandatory UDIN numbers).
   - *Solution:* An automated pre-underwriting audit checklist that cross-checks files, validates UDIN numbers, and generates a real-time "Document Readiness Score".
