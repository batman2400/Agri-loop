# AgriLoop 🌾🔄

> **SDG Solutions Challenge 2026 — Team Fade**  
> Surplus Food Redistribution Platform Concept connecting retail food vendors and wholesale produce markets with buyers and community recipients through scheduled self-collection.

---

## 📌 Executive Summary

**AgriLoop** is an idea-stage surplus food redistribution platform designed for Sri Lanka to tackle urban food waste and improve food accessibility. By providing structured scheduling, verified listings, and self-collection workflows, AgriLoop enables food businesses to redirect safe, eligible surplus to nearby consumers at discounted rates or to community kitchens and welfare organizations as free donations.

AgriLoop aligns directly with the United Nations Sustainable Development Goals:
* **Primary Target:** **SDG 12.3** — Halve per capita global food waste at retail and consumer levels and reduce food losses along production and supply chains.
* **Secondary Target:** **SDG 2.1** — End hunger and ensure access by all people to safe, nutritious, and sufficient food year-round.

---

## 👥 Team Fade

Developed by second-year Software Engineering undergraduates at **General Sir John Kotelawala Defence University (KDU)**:

* **Mohanaram Uvaram** — Backend Development, Stock Logic & Data Integrity
* **Manidu Samaranayake** — Interface Usability, Frontend Architecture & User Flows
* **Yasith Peiris** — Coordination, Stakeholder Research & Vendor Interviews

---

## 🎯 Confirmed Operating Model

AgriLoop is anchored on five foundational design decisions confirmed for the project:

1. **Current Stage:** **Idea stage**. All technical designs, pilot budgets, and workflows are structured proposals ready for prototype validation; no live prototype or commercial partnerships are claimed.
2. **Dual-Stream Scope:** Covers both:
   * *Retail Surplus:* Small, pre-packaged consumer bundles from bakeries, eateries, and grocers.
   * *Wholesale Produce:* Larger Grade-B/surplus produce lots from regional wholesale markets (e.g., Peliyagoda).
3. **Transaction Modes:**
   * *Discounted Sales:* Affordable, reduced-price food for price-conscious consumers.
   * *Free Food Donations:* Zero food price and zero platform fee for welfare organizations, canteens, and vulnerable groups.
4. **Fulfilment Model:** **Buyer / recipient self-collection** within vendor-specified pickup windows. AgriLoop does not operate an internal delivery fleet.
5. **Organizational Model:** A sustainable business model with a free, cross-subsidized donation channel.

---

## 📁 Repository Structure & Key Deliverables

This repository contains all official deliverables, pitch presentations, verification audits, technical specifications, and challenge documentation:

```
├── README.md                                          # Project overview and repository documentation
├── .gitignore                                         # Git ignore rules for clean repository hygiene
│
├── Fade_Submission1_ConceptDeck_Confirmed.pdf         # 🎯 Final Confirmed Concept Deck (PDF)
├── Fade_Submission1_ConceptDeck.pdf                   # Concept Deck (Working Version PDF)
├── TeamFade_ConceptDeck.pptx                          # Concept Deck Source (PowerPoint)
│
├── Fade_Submission1_Evaluation_Final.xlsx             # Checkpoint 2 Official Evaluation & Rubric Scoring
├── Problem Validation Submission Template-B_ro2dUj.docx # Official SDG Challenge Validation Template
├── SDG Solutions Challenge 2026 Handbook.docx-C2yKyJ3Y (1).pdf # Official Challenge Rules & Handbook
├── SDG Sprints 2026 Solution Concept Deck Template-BdR3L98D.pptx # Official Concept Deck Template
├── Team_Fade_Problem_Validation_Submission (1).pdf    # Checkpoint 2 Problem Validation Submission PDF
│
├── output/
│   ├── Fade_Submission1_ConceptDeck_Confirmed.pptx    # 🎯 Final Confirmed Concept Deck (PowerPoint)
│   ├── Fade_Submission1_ConceptDeck.pptx              # Concept Deck (Working Version PPTX)
│   ├── AgriLoop_AI_Context.md                         # 🧠 Complete Handover, AI Context & Technical Specs
│   ├── AgriLoop_Corrected_Rehearsal_Pack.md           # 🎤 Slide-by-slide Pitch Script & Jury Q&A Defense
│   ├── AgriLoop_Verification_Report.md                # 🔍 12-page Submission-Readiness & Fact-Check Audit
│   ├── AgriLoop_Verification_Report.pdf               # Formatted Verification Audit Report (PDF)
│   └── pdf/
│       └── AgriLoop_Complete_Project_Guide.pdf        # 📖 24-page Human-Facing Complete Project Guide
│
└── audit_work/
    └── build_report.py                                # Automated ReportLab compiler for audit PDF
```

---

## 📑 Core Documentation Highlights

* **[Concept Deck (Confirmed)](Fade_Submission1_ConceptDeck_Confirmed.pdf):** 14-slide visual pitch presentation meeting all SDG Sprint guidelines, timing parameters, and font compliance.
* **[Spoken Rehearsal Pack](output/AgriLoop_Corrected_Rehearsal_Pack.md):** Exact spoken pitch scripts calibrated at 130 words/minute for all 14 slides, paired with detailed defense answers for anticipated jury questions.
* **[Complete Project Guide](output/pdf/AgriLoop_Complete_Project_Guide.pdf):** In-depth 24-page reference covering problem space, user journeys, food safety boundaries, and operational risks.
* **[AI Context & Technical Specification](output/AgriLoop_AI_Context.md):** 750+ line self-contained architecture document detailing database schemas (PostgreSQL/Supabase), atomic stock locking, state transition tables, and API requirements.
* **[Verification & Audit Report](output/AgriLoop_Verification_Report.md):** Independent audit reconciling statistical claims, arithmetic consistency, citation accuracy, and food-safety boundaries.

---

## 🛠️ Proposed Technical Architecture

* **Client:** Responsive Web Application (optimized for mobile browsers to avoid mandatory app installs for vendors and recipients).
* **Backend:** REST / Edge Functions (Node.js / TypeScript).
* **Database & Auth:** PostgreSQL hosted via Supabase with Row Level Security (RLS).
* **Stock & Concurrency:** Atomic database transactions (`SELECT FOR UPDATE` or stored procedures) to guarantee that retail surplus bundles cannot be overbooked during concurrent checkout.
* **Prototype Hosting:** Proposed lightweight cloud hosting (Render + Supabase free/starter tier) with local fallback.

---

## ⚖️ Food Safety & Risk Mitigation

* **Simulated Prototype Phase:** All initial usability and stock validation tests will be run with simulated/mock food items.
* **Pre-Pilot Requirements:** Prior to any live-food transfers, formal consultation with qualified food safety authorities and mentors will be conducted to establish category-specific holding protocols, temperature constraints, and liability frameworks under local Sri Lankan food regulations.

---

*© 2026 Team Fade — General Sir John Kotelawala Defence University. Prepared for the SDG Solutions Challenge 2026.*
