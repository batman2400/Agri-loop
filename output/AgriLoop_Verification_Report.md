# AgriLoop: verification and submission-readiness report
Team Fade | Review date: 18 October 2026 | Scope: supplied files and pasted blueprint

## Overall finding
The pasted analysis is not fully verified and should not be submitted unchanged. It correctly recognizes several weaknesses in Checkpoint 2, but introduces new unsupported details, incorrect references, unproven completion claims, and inconsistent impact calculations. The concept remains a reasonable candidate for a tightly scoped pilot. The available evidence does not yet establish adoption, safe redistribution, financial sustainability, or the proposed scale of impact.

The evaluation's 63/100 adds up correctly. Its substantive concerns are largely justified, but the evaluator is not an infallible source: the urban food-insecurity discrepancy partly originates in the research publication, and the workbook's promised automatic calculations do not exist.

### Highest-priority corrections
- Replace the incorrect HARTI report title and MDPI authors. Remove the unsupported interview quotation and exact fieldwork dates unless original records confirm them.
- Treat primary findings as team-reported observations, not independently authenticated results. Remove claims that all sorted-out produce was edible or chemically safe.
- Replace the universal three-hour safety rule and disclaimers-as-compliance language with a food-category-specific protocol reviewed by an appropriate local food-safety professional.
- Label the product, partnerships, pilot targets, technology, and commercial model as proposed unless evidence shows otherwise.
- Reconcile meal prices, food weights, pilot sizes, operating periods, and costs in one explicit model.
- Resolve the deadline conflict. Work toward 29 October 2026 at 11:59 p.m., the earlier date printed in the deck template, pending organizer confirmation.

### What was examined
All five files originally present in the folder: the evaluation workbook; the completed four-page problem-validation PDF; the official problem-validation DOCX template; the four-page handbook PDF; and the 14-slide concept-deck PPTX template. The pasted text was reviewed in full, including its Python inspection excerpts and proposed 13-slide deck content.

The folder contains no raw survey responses, interview transcripts, audit logs, field photographs, source-code repository, completed AgriLoop concept deck, pilot agreements, or testing results. Their absence is a verification limit, not proof that the activities never occurred. Originals were preserved.

This is a documentary, source, arithmetic, and design review. It does not authenticate fieldwork, certify food-safety compliance, reproduce survey microdata estimates, or award a replacement official grade. The PPTX supplied is a blank template, so final AgriLoop slide layout and font compliance cannot yet be verified.

[[PAGE]]
## 1. Evaluation and workbook audit
### The recorded score is internally consistent
The seven awarded scores are 11/15 for context, 8/15 for root causes, 13/20 for evidence, 10/15 for stakeholders, 9/15 for methodology, 6/10 for insights, and 6/10 for the refined statement. These total 63/100. Maximums total 100; every score is within its maximum; the Criterion Detail sheet agrees with Score Summary. The rubric maximums match Section 8 of the official validation template. [L1, L3]

The largest numerical shortfalls are root-cause analysis and evidence, at seven marks each, followed by methodology at six. These identify useful areas for revision, but do not predict marks recoverable in Checkpoint 3, which is a different assessment.

### Important workbook defect
Score Summary!B18 and C18 contain fixed numbers, 100 and 63. The checks in D11:D18 are fixed text. There are no formula cells anywhere in the workbook. This contradicts the instructions in rows 20-21 that totals and checks calculate automatically. No stored Excel error cells were found, but this does not establish calculation functionality.

The current score is correct. Future changes to criterion scores would leave the total and checks stale. If the workbook is to be reused, C18 should calculate SUM(C11:C17), B18 should calculate SUM(B11:B17), and each limit check should test numeric values and 0 <= score <= maximum. Detail-sheet scores should also be linked or reconciled. This review did not modify the evaluator's file. [L1]

### What the evaluation gets right
It appropriately distinguishes households from people, whole-chain losses from local daily disposal, willingness from observed behavior, and farmer proxy input from direct farmer interviews. It correctly questions the unsupported 8-15% discard rate, the 55-65% income share, the missing WFP/CBSL findings, and the solution-shaped root cause. [L1-L3]

### What needs qualification
The evaluator's food-insecurity fact check overlooks an internal inconsistency in the source, described on the next page. Its severe-insecurity figure also needs correction. Its statement that primary data are internally consistent is too broad: Section 3 describes five students and wage workers, while Section 5 describes five wage laborers. Clarify whether these are the same participants. [L1, L2]

October 2026 is documented as the fieldwork month in the original reference list; precise days and recruitment methods are not. The pasted analysis may retain the month, but cannot manufacture the missing dates or label the sample a confirmed convenience sample without recruitment records.

The submission cover is dated 12 October, while the declaration is dated 8 October. The pasted chronology places research on 9-12 October, after that declaration. Verify the actual chronology and sign a corrected declaration if required; do not backdate records. The submission's self-awarded 100/100 is not an official result.

The handbook assigns Checkpoint 2 a 25-mark competition weight. Proportional conversion would yield 15.75/25, but this is only an arithmetic interpretation, not a confirmed organizer conversion rule. [L4]

[[PAGE]]
## 2. External statistics and reference corrections
### BRIGHT: retain the headline, acknowledge the source discrepancy
The retrieved BRIGHT PDF's Table 2 (p. 5) reports 32.8% nationally and 35.3% urban; Figure 1 (p. 6) shows 6.7% urban in the earlier period and 35.3% later. Its narrative instead prints 35.5%. Thus the original submission's endpoint has a source basis; use the table/chart value and disclose the inconsistency. Table 2 gives 29.6% moderate and 3.1% severe nationally, not 3.2%; nearby prose also differs. Preserve reported totals rather than deriving components by subtraction. [S1]

Use: “In the 2024-2025 BRIGHT survey, 32.8% of Sri Lankan households experienced moderate or severe food insecurity during the previous 12 months; the urban estimate was 35.3% (Table 2).” This is not a current-2026 population estimate, a student-specific rate, or a clinical malnutrition measure. FIES and WFP's CARI are not interchangeable. [S1]

The correct title is Food insecurity in post-crisis Sri Lanka: Evidence from the 2024-2025 BRIGHT survey, by Headey and colleagues. IFPRI's catalogue calls it Project Note 4; the retrieved PDF cover says Note 2. Cite title, authors, year and link, noting that metadata discrepancy. [S1, S2]

### HARTI: the purported corrected citation is still wrong
HARTI's official catalogue identifies Research Report 217 (2018) as Quality and safety issues in fruit and vegetable supply chains in Sri Lanka: a review, by Ruvini Vidanapathirana, Jayamini Champika, Roshini Rambukwella and Nalaka Wijesooriya. The pasted blueprint attaches a different title to that report number. [S3]

The evaluator supports the broad 20-40% loss range, but the full HARTI PDF could not be retrieved during this review. Exact percentage, page and measurement scope therefore remain unverified here. Do not relabel it as daily Colombo disposal, all fresh produce, purely transport loss, or entirely recoverable edible surplus. Use it only after locating the supporting passage and its original cited study, or omit the percentage from headline slides. [L1, S3]

### Colombo food-waste paper: correct authors and denominator
The authors are Maren Reitemeier, Mohamed Aheeyar and Pay Drechsel, not the three authors listed in the pasted text. The correct title is Perceptions of Food Waste Reduction in Sri Lanka's Commercial Capital, Colombo, Sustainability 13(2), article 838, 2021. [S4]

Its introduction attributes about 42% of Colombo food waste to restaurants, markets and abattoirs/meat shops, citing earlier research. It is not “42% of institutional waste,” a fresh 2021 weighing result, or an edible-recovery rate. The paper is a qualitative stakeholder study. Avoid changing “food waste generated” to “landfill intake”; these are different quantities. Its national food-waste share is approximately 50%, with cited estimates up to 69%, rather than the blueprint's unsupported exact 50-66% framing. [S4]

### Remove or withhold the remaining unsupported figures
The 8-15% retail discard rate, 55-65% income allocation, 20-35% farmer write-offs and >60% Grade-B share need traceable evidence. The 5,000 MT/day national claim remains unverified; do not substitute 4,000 merely because it looks plausible. WFP/CBSL titles in the blueprint are not adequate bibliographic records, and neither source supports the cited assertions about soup-kitchen stigma or volunteer response speed. [L1, L2, pasted text]

[[PAGE]]
## 3. Primary evidence: what it does and does not establish
### Retain with explicit attribution
The original submission reports four market vendors, three bakery/cafeteria managers, a survey of 42 respondents, two commission agents, one driver, one kitchen coordinator and unspecified mentors. These are reported sample counts, not verified attendance records. Different groups may overlap; do not add them into a unique participant total. [L2, Sections 3, 5-7]

The reported 78.6% and 83.3% are arithmetically compatible with 33/42 and 35/42. This assumes every respondent answered each question, no weighting, and conventional rounding. Only the response export can confirm those assumptions. “Budget,” “income,” and “allowance” are not interchangeable denominators; use the exact questionnaire wording.

“100% of managers” means three of three in the reported interviews. Write the count. It does not establish general willingness across Sri Lankan retailers. The reported 50-70% discount is hypothetical vendor willingness, not achieved selling prices or a proven sustainable margin.

The 15-20% sorted-out figure needs a denominator: arrivals, inventory, weight, or item count. The 40-70 kg/day figure needs dates, stall-level records and separation between weighed observations and vendor recollection. Neither figure establishes that every kilogram was safe to redistribute. The 15-30 bakery items are items, not meals or kilograms.

### Unsupported additions in the pasted blueprint
- The verbatim bakery-manager quotation is not present in the submission or supporting records. Remove quotation marks and use a clearly attributed summary, or supply the authentic transcript and permission.
- Exact audit dates of 9-10 October, interviews on 10-11 October and survey dates of 10-12 October are not supported by the supplied files.
- Ages 19-26, a meal budget below LKR 25,000, universal smartphone/4G access and LKR 700-1,100 daily nutrition costs are proposed persona details, not established findings.
- Member names beyond the leader, degree/intake, job assignments, skills and specific mentor advice are not substantiated by the folder. They may be true; confirm against team records.
- The contact email and phone in the blueprint need owner confirmation before publication. The original NIC is unnecessary for the public concept deck.
- A scaffolded GitHub repository, merchant-tested wireframes, an early prototype, and “[In progress]” features have no supporting implementation artifacts here. Use “Planned” or “Concept design” pending evidence.
- No search log substantiates the claimed searches of Scholar, IEEE Xplore or NIPO. Do not describe unrecorded research as completed.

### Evidence pack needed
Preserve a de-identified survey export, questionnaire, recruitment method, dates, item-level denominators and missing-response counts. Add interview guides and coded notes; distinguish direct quotes from paraphrases. For audits record site, date, observation interval, commodity, total handled, rejected quantity, rejection reason, measurement method and destination. Record whether safety judgments were made by a qualified person.

Keep a source-to-claim register and a separate assumptions register. Log consent and restrict access to identifying information. If original records cannot be recovered, downgrade the claims to preliminary team recollections and conduct a small new documented study. Do not reconstruct historical evidence from the desired deck narrative.

[[PAGE]]
## 4. Causal reasoning and concept scope
### A useful hypothesis is not yet a verified cause
The pasted revision improves the 5-Whys by replacing “missing platform” with coordination costs. However, “cost exceeds salvage value” is still a hypothesis derived from limited team-reported interviews, not a measured economic result. Do not label it a verified root cause.

A defensible chain is: unsold inventory remains near closing; some inventory has a short usable window; staff may lack time or incentives to arrange buyers or recipients; collection and handling can cost more than expected recovery revenue. Test each link against time logs, actual residual quantities, recovery prices and pickup costs. Consider competing explanations: damaged stock, insufficient demand at the proposed time, unpredictable supply, safety concerns and unsuitable portion sizes.

The marketplace addresses discovery, reservation and coordination. It does not directly repair transport damage, increase refrigeration capacity, create purchasing power, or remove all stigma. National hunger and national losses do not by themselves prove that the same food can reach the same households safely and economically.

### Suggested problem wording
“Team Fade's preliminary interviews in Colombo and Dehiwala report unsold bakery items near closing and difficulty arranging small-batch redistribution. A documented pilot is needed to measure how much eligible surplus can reach nearby buyers at an affordable total cost before the approved collection cutoff.”

Present national context separately with its source and time period. This wording avoids treating a particular app as the problem or presenting local causality as established.

### Suggested concept wording
“AgriLoop is a proposed service that lets participating food vendors list eligible surplus for nearby buyers to reserve and collect during an approved pickup window.”

“Eligible” must be defined by a reviewed handling protocol. Avoid “zero-friction,” “zero logistics cost,” “guaranteed safe,” “eliminates stigma,” and “consumers switch immediately.” Self-pickup transfers travel costs to the buyer; it does not eliminate them.

### Recommended pilot boundary
Start with one retail corridor, a small confirmed vendor group and an explicitly approved set of food categories. Test manual listing, reservation, stock control, pickup verification and records. Keep wholesale-to-kitchen distribution as a separate planned workstream until recipients, handling, transport, storage and responsibility are confirmed.

Retail portions and wholesale loads have different operating models. A student collecting a bag and a kitchen moving 100 kg are not the same logistics problem. Give each stream its own cost and safety model. This recommendation narrows execution risk; it does not require abandoning the longer-term dual-stream concept.

### Demand and humanitarian fit
The buyer may be a smartphone-owning student without being food insecure. Measure who actually benefits, without unnecessary sensitive-data collection. Check total purchase plus travel cost, late-night access, disability access, language needs and ability to collect during the proposed window. Affordable bakery surplus is not automatically a nutritionally balanced meal.

[[PAGE]]
## 5. Quantitative audit of prices and impact
### Price claims do not reconcile
For baseline prices of LKR 550-750 and proposed prices of LKR 200-250, the endpoint reductions range from 54.5% (550 to 250) to 73.3% (750 to 200). The midpoint comparison, 650 to 225, is 65.4%. A “58% cut” cannot be derived from the stated ranges without selecting a specific matched pair.

Gross savings span LKR 300-550 per purchase under those endpoints; “over LKR 500 daily” is not generally established. Compare the same food quantity and quality, at a documented reference price, and subtract travel and other incremental costs. The LKR 300 five-item bundle and LKR 200-250 meal target describe different products unless portions are defined.

### Weights, items and meals have been mixed
At 160 kg/month/vendor, 15 vendors would transfer 7,200 kg over three months. The separate claim of 7,200 meals would imply 1 kg per meal if it represents that same retail stream. No average item or meal mass is supplied. Do not use identical numbers as if the units were interchangeable.

At 30 operating days, 160 kg/month means 5.33 kg/day/vendor. With 60% listing frequency and 80% claim rate, the required listed-day quantity is 11.11 kg, assuming all claims are collected. Observed leftovers of 15-30 items do not establish that weight.

To reach 7,200 completed meals over an assumed 90-day period:
15 vendors x 90 days x 60% listing days x meals per listing day x 80% claim rate x collection rate = 7,200.
With collection rate set to 100%, the missing input is 11.11 meals per listing day. With lower collection, more listings are needed. None of these rates has been measured in the supplied material.

7,200 meals divided by 1,200 active users equals six meals/user over three months. Define “active” and report unique buyers separately from transactions and meals. The 3 MT/month wholesale target equals 100 kg/day on a 30-day assumption, requiring confirmed kitchen capacity and transport.

At 250 outlets and 160 kg/month, the retail total is 40 MT/month, not 45. An additional 5 MT from wholesale or different throughput assumptions could reconcile it, but the blueprint provides neither. The 35,000 beneficiaries and 40 kitchens also lack a derivation.

### Replace invented baselines
“0 kg rescued” may mean zero AgriLoop-mediated collection before launch. It does not establish that all surplus was dumped: existing discounts, donations, staff meals or animal feed may already absorb it. Measure existing destinations and eligible surplus before intervention.

Record completed pickup weight, not just reservations or QR scans. Separate listed, reserved, collected, cancelled and expired quantities. Record portions separately. Measure additional diversion against observed pre-pilot disposal; distinguish human consumption from animal feed and compost. Avoid counting the same lot at both wholesale dispatch and kitchen receipt.

[[PAGE]]
## 6. Budget and operating model
### Correct sum; incomplete business case
The three proposed budget lines sum correctly: LKR 12,000 hosting + 8,500 onboarding + 14,500 field logistics/packaging = LKR 35,000. These are estimates without quotations, usage assumptions or procurement evidence. Correct addition does not establish affordability.

The document simultaneously promises cost-free cloud hosting and budgets LKR 12,000 for it. It refers to a two-month hosting pilot, a three-month impact pilot, ten onboarding outlets, fifteen impact vendors and a two-bakery prototype test. These can be legitimate phases, but must be named and reconciled.

Recommended phase definitions: prototype usability test; small operational pilot; expansion scenario. For each specify dates, vendors, participants, food categories, staffing, spending and acceptance criteria. Label the 15-vendor/1,200-user and Year-2 projections as scenarios, not commitments.

### Commission arithmetic
A proposed 5% commission generates LKR 10 on a LKR 200 transaction and LKR 12.50 on LKR 250. Recovering LKR 35,000 would therefore require 3,500 or 2,800 paid transactions before any variable or ongoing costs. Because the blueprint makes the pilot free, that commission cannot fund the free pilot unless a later revenue period is explicitly modeled.

If LKR 12,000 hosting is for two months, hosting alone averages LKR 6,000/month. At those commission amounts, 600 or 480 transactions/month would cover hosting only. These are illustrative calculations from proposed inputs, not forecasts or break-even estimates for the whole operation.

Model monthly contribution as completed transactions x (commission revenue - transaction-variable cost), less fixed operating cost. Include staff time, support, connectivity, messages, hosting, maps, packaging, verification, refunds/disputes, training, transport and contingency where applicable. Disclose unpaid team labor rather than treating it as economically nonexistent.

### Cash payment needs a collection mechanism
If buyers pay vendors in cash, the platform does not automatically receive its commission. Explain reconciliation, invoicing or prepaid vendor credits, and the incentive for accurate reporting. Decide who handles cancellations, shortages, refunds and complaints. Payment integrations described elsewhere must remain planned while online payments are out of scope for the pilot.

CSR sponsorship is a possible funding source, not confirmed income. Permanently fee-free wholesale routing needs a recurring budget and a funded operator. Open-source components do not eliminate foreign-currency exposure when hosting, messaging or commercial map services are billed externally.

Vercel's documented Hobby plan is restricted to personal, non-commercial use. Confirm a suitable plan for the actual pilot; a free student demonstration and a commercial marketplace are different use cases. OpenStreetMap data are open, but its public tile service is not an unlimited offline map backend. Its standard tile policy prohibits bulk downloading for offline use. [S8, S9]

[[PAGE]]
## 7. Technical, food-safety and inclusion review
### Architecture needs one coherent implementation plan
“Next.js / React Native PWA” is ambiguous. Select a browser-based React/Next.js PWA for the proposed first version, or document a native application and its separate deployment path. Likewise, choose and distinguish a map renderer, map data, tile provider, geocoding and radius search rather than listing Mapbox, OpenStreetMap and Leaflet as interchangeable services.

A minimal flow is vendor listing -> server-side stock reservation -> pickup verification -> completed transfer record. Maintain listing, reservation and redemption states separately. Enforce merchant ownership, atomic stock updates, single redemption, server-side expiry and auditable cancellation. A QR image alone is not a security control or a measurement of food weight.

Cached tokens do not solve offline double redemption. Two disconnected scanners can both accept the same valid token. For an initial pilot, require connectivity for final redemption or use a tightly controlled manual fallback with a single authoritative record. Test replay, concurrent reservations, expired/cancelled tokens, cross-vendor access and recovery after interrupted requests. A time-varying token can still be replayed within its validity window unless the redemption state is enforced.

GPS radius measures distance, not safe walking routes or travel time. The survey describes 2 km while the proposed system uses 2.5 km; label the latter a testable design choice. Thirty-second posting, 45-second staff availability, 45-minute pickup and five-second verification are proposed performance targets, not established results.

### Food-safety claims require substantive revision
No evidence supports a universal three-hour safe window. WHO's general guidance advises not leaving cooked food at room temperature for more than two hours and emphasizes temperature control. That is not a substitute for a category-specific local protocol. Sri Lanka's Food Act and Food (Hygiene) Regulations are relevant; a timestamp, QR code or disclaimer does not demonstrate compliance. [S6, S7]

Before a food-distribution trial, obtain qualified guidance on eligible categories, preparation and storage history, temperature control, allergens, packaging, collection limits, traceability, rejection, complaints and recall. A vendor's declaration cannot establish chemical or microbiological safety. “Grade-B” appearance and “safe to eat” must remain separate determinations.

The blueprint offers hot meals, excludes unchilled cooked items, requires sealed packaging and also promotes customer containers. Resolve these operating choices. Avoid assigning food safety “low likelihood” or regulatory impact “medium” without a reasoned assessment; the consequences can be serious.

### Privacy and inclusion
Anonymous-looking claim IDs are usually pseudonymous if linked to accounts, phone numbers, location or transactions. Specify what is stored, who can access it, why it is needed and when it is deleted. Plan participant consent and a reachable complaint channel.

A trilingual interface is a planned feature until implemented and tested. Language coverage alone does not prove accessibility. Test readability, screen readers, low-bandwidth use, non-smartphone access, late-night travel constraints and safe collection. Do not claim stigma is eliminated without user evidence.

[[PAGE]]
## 8. Prior art, SDGs and competition requirements
### The proposed competitive analysis is not reliable
Too Good To Go's official store terms describe fees set by account/commercial terms, not a universal 25-30% rate. Its marketplace covers manufacturers as well as retailers and food service. The blanket statement that it ignores upstream supply is overbroad; a specific comparison to wholesale produce workflows requires product-level evidence. “Requires credit cards” is also insufficiently sourced and should be removed unless verified for a stated country and period. [S5]

Use actual named alternatives with date, geography, workflow and source. WFP food-security reporting does not prove soup-kitchen stigma. CBSL price reporting does not prove volunteer pickup delays. The blueprint's references [5] and [6] are mismatched to those competitor assertions.

A search located FoodLoop's own Sri Lanka-facing site describing surplus matching, a map and digital receipts, as well as Robin Hood Army's official description of surplus redistribution and Sri Lankan presence. These are relevant leads that undermine a categorical “no local digital system” claim. Their marketing does not independently prove operations, scale or effectiveness. Record this distinction. [S10, S11]

The defensible innovation claim is a proposed local adaptation to be tested, such as low-bandwidth vendor posting, cash-compatible collection and a documented wholesale extension. Do not claim national or regional uniqueness without a dated search and feature comparison. Do not list patent/database searches as completed without a record.

### SDG mapping
Targets 12.3 and 2.1 are relevant to food-waste reduction and food access. Official indicators include 12.3.1 (food loss and food waste indices) and 2.1.2 (moderate/severe food insecurity prevalence). Pilot collection weights and buyer savings are project measures contributing to these aims, not replacements for the official indicators or proof of national change. [S12, S13]

The registered problem IDs [2.2], [12.2], [1.3] must not be silently treated as UN target numbers. The problem-pool descriptions were not supplied. Confirm their meaning against registration records. Retain the registered IDs; explain the particular SDG targets relevant to the proposed intervention. Poverty reduction and improved nutrition require evidence beyond counting discounted bakery items.

### Submission requirements and conflicts
The PPTX requires deleting its instruction slide, retaining 12 core slides in order, and adding at most two appendix slides. One references appendix gives 13 submitted slides, but it is not the only permitted appendix count. The instructions also allow extra slides, creating some ambiguity; keeping the specified core and appendix limits is the conservative choice. [L5]

Required: replace prompts; use body text at least 14 pt; cite sources; label Done/In progress/Planned honestly; export TeamName_SubmissionNo_ConceptDeck.pdf; use the same document for the concept pitch. The ten timed sections sum to 480 seconds, or eight minutes; cover, team and appendix are untimed. Text alone cannot prove font or timing compliance.

The template prints 29 October 2026 at 11:59 p.m.; the handbook lists the concept-deck window as 20 October-3 November and warns dates may change. No definitive updated organizer notice was established in this review. Use the earlier date for planning and confirm the deadline/timezone with the organizer. The handbook's five-minute pitch concerns the final showcase, not necessarily the concept pitch. [L4, L5]

[[PAGE]]
## 9. Slide-by-slide revision instructions
### Slides 1-4: cover, team, problem and users
1. Cover: retain AgriLoop as the proposed name; replace “zero-friction” with a concrete description. Confirm registration IDs and submission number. Use the actual submission date. The quotation is optional decoration and adds no evidence.
2. Team: confirm all names, degrees, roles and skills. Name a mentor and advice only if actually received. The template permits a blank mentor field when there is none. Remove unused member cards.
3. Problem: use a solution-neutral local statement; keep national context separate. Use the corrected household statistic. Withhold the HARTI range until its passage is checked. Do not use the 42% figure as a proxy for recoverable bakery surplus. Label causal claims as hypotheses.
4. Users: replace unsupported age, budget and connectivity claims with a proposed recruitment segment. Retain n=42 and reported percentages only with limitations. Remove the unsupported quotation. Distinguish buyers, vendors, kitchens and regulators.

### Slides 5-8: solution, workflow, innovation and impact
5. Solution: describe the retail MVP and mark its status accurately. Keep wholesale routing planned. Replace guarantees of safe nutrition, instant adoption and stigma elimination with outcomes to test.
6. Workflow: show listing, reservation, pickup and confirmation. Use one technical architecture. Separate reservation expiry from food-safety eligibility. Explain stock control, cancellation and a connectivity failure procedure.
7. Innovation: compare named alternatives using genuine sources; correct the Too Good To Go characterization. Include local prior-art leads. Describe differentiation as intended until tested.
8. Impact: replace zero-disposal baselines with measured baseline definitions. Define units and periods. Show the assumptions connecting vendors, listing days, quantity, claim rate, pickup rate, unique buyers and weights. Mark every target as planned.

### Slides 9-13: feasibility through references
9. Feasibility: remove “cost-free” and “eliminating foreign currency dependencies.” State estimated recurring cost and who pays. Present food-safety review as pending, not achieved. Explain commission collection for cash purchases.
10. Prototype: select one current stage; concept design is supported by this folder, early prototype is not. Distinguish the two-bakery test from ten-outlet onboarding and fifteen-vendor expansion. Align the four-week development plan with the handbook's 13 November-10 December prototype window if still applicable. Define test conditions and acceptance criteria.
11. Risks: add duplicate redemption, uncollected food, supply unreliability, exclusion and late pickup. Replace the three-hour rule and unsupported low-risk labels. Resolve packaging and offline-payment contradictions.
12. Closing: give a narrow pilot ask, such as vendor access and food-safety advice. Named chains are prospective introductions, not partners. Confirm contact details and remove absolute outcome claims.
13. References: use corrected authors/titles and working links; add access dates and page/table locators. Separate primary evidence from external references and assumptions. Remove claims of a completed repository or validated wireframes without artifacts. A second permitted appendix can hold methods and impact assumptions.

Do not paste this full blueprint onto slides. Its volume is unlikely to fit comfortably at 14 pt while remaining speakable in eight minutes. Build the actual deck, render every slide and rehearse the timed sections before claiming template compliance. A maximum score or immunity from deductions cannot be promised.

[[PAGE]]
## 10. Prioritized completion plan
### Before locking the narrative
Owner: team lead and evidence owner. Confirm registration IDs, deadline, roster, contact details, dates and work status. Correct references, remove unsupported additions, and recover original primary records. Maintain a simple claim register with evidence location, scope, status and permitted wording.

### Before claiming demand or pilot partnerships
Owner: field-research lead. Obtain actual vendor and recipient commitments. Record eligible surplus over several relevant operating days, including low-surplus days. Test a manual reservation-and-pickup flow. Observe completed collection, time spent by staff, cancellations, buyer travel cost and repeat use. Report the actual sample without generalizing it nationally.

### Before distributing food
Owner: operational lead with a qualified local advisor. Agree the food categories, handling and collection protocol, vendor obligations, complaint/recall process, packaging and recordkeeping. Document the review and do not imply regulatory approval unless it was actually granted.

### Before finalizing impact and finance slides
Owner: finance/measurement lead. Create one assumption set for each phase. Define item, bundle, meal, kilogram, active buyer and beneficiary. Reconcile retail and wholesale totals. Obtain cost estimates and explain recurring funding. Separate actual observations, calculations from those observations, and hypothetical targets.

### Before labeling software as built
Owner: engineering lead. Preserve repository history and a runnable demonstration. Test authorization, stock competition, replay, cancellation, expiry and poor connectivity. Record the devices, conditions, sample size and results. A twenty-transaction demonstration does not establish production reliability or food safety.

### Before submission
Owner: team lead. Replace all template prompts, remove the instruction slide, maintain slide order, check all body text at 14 pt or larger, render the exported PDF, check citations and statuses, rehearse the eight-minute concept pitch, and use the required filename. Keep an editable source copy.

### Recommended evidence language
Use “verified against the cited source” only for a genuinely checked claim. Use “reported in our preliminary interviews” for uncorroborated primary summaries. Use “hypothesis” for an explanation requiring testing. Use “planned target” for future quantities. Use “not established by supplied evidence” instead of calling an unsupported claim false.

### Review limitations and unresolved items
The HARTI full report was inaccessible through attempted retrieval, so its precise loss passage remains open. The problem-pool definitions, organizer's latest deadline notice, team roster, raw fieldwork, live prototype and commercial quotes were unavailable. The supplied evaluation's provenance as an official organizer-issued score cannot be authenticated solely from the filename, although its content and arithmetic were inspected.

The published BRIGHT material contains editorial inconsistencies; the report uses its table/chart values and notes the differences. Public competitor websites establish advertised features, not independently audited operations. No promises about marks, launch success or regulatory clearance are warranted.

The review is complete for the supplied documentary evidence, with these verification gaps explicitly retained. The next useful step is evidence repair and a small measured pilot, followed by a concise deck reflecting what is actually known.

[[PAGE]]
## Sources and evidence locations
### Supplied materials
L1. Fade_Submission1_Evaluation_Final.xlsx. Score Summary A10:D21; Criterion Detail rows 2-8; Fact-Check; Feedback. Cell values, types, formulas and errors inspected without modification.
L2. Team_Fade_Problem_Validation_Submission (1).pdf. Four pages; Sections 1-9. Primary-research counts and findings are team assertions in this document, not raw data.
L3. Problem Validation Submission Template-B_ro2dUj.docx. Instructions and Sections 3-9, particularly the seven-criterion rubric.
L4. SDG Solutions Challenge 2026 Handbook.docx-C2yKyJ3Y (1).pdf. Page 2 roadmap/weights; pages 1 and 3 team and evaluation guidance.
L5. SDG Sprints 2026 Solution Concept Deck Template-BdR3L98D.pptx. Slide 1 instructions/deadline; slides 2-14 prompts and structure. All slide text and table text inspected.
L6. Pasted text.txt supplied in this chat. Entire analysis and proposed slide content reviewed. This is the object of verification, not an independent evidentiary source.

### External sources checked on 18 October 2026
S1. D. Headey et al., Food insecurity in post-crisis Sri Lanka: Evidence from the 2024-2025 BRIGHT survey, 2025. Table 2, Figure 1 and accompanying prose. [Direct PDF](https://cgspace.cgiar.org/server/api/core/bitstreams/3714264a-7860-4a77-b9dc-1dffb100e327/content). Note-number and text/table discrepancies are documented in this report.
S2. IFPRI, [BRIGHT Sri Lanka project and publication catalogue](https://www.ifpri.org/project/bright-sri-lanka/).
S3. HARTI, [official research-report catalogue, Report 217](https://www.harti.gov.lk/publications.php?author=&category=research_reports&page=6&publish_year=). Title/authors/year verified from the indexed official catalogue; full PDF retrieval failed.
S4. M. Reitemeier, M. Aheeyar and P. Drechsel, [Perceptions of Food Waste Reduction in Sri Lanka's Commercial Capital, Colombo](https://www.mdpi.com/2071-1050/13/2/838), Sustainability, 13(2), 838, 2021. DOI: 10.3390/su13020838. Introduction and methods.
S5. Too Good To Go, [Marketplace Store Terms](https://www.toogoodtogo.com/en-us/legal/terms-and-conditions-marketplace), version 3.0, effective 16 June 2025. Sections 1 and 6. Terms are jurisdiction-specific.
S6. WHO, [Five keys to safer food](https://www.who.int/docs/librariesprovider2/default-document-library/5keys_en.pdf). General handling guidance, not a local compliance certificate.
S7. Sri Lanka Ministry of Health, [Food Act](https://eohfs.health.gov.lk/food/index.php?Itemid=158&id=17&lang=en&option=com_content&view=article) and [Food (Hygiene) Regulations 2011](https://www.eohfs.health.gov.lk/food/images/pdf/regulations/food_hygiene_regulations_2011_en.pdf).
S8. Vercel, [Hobby Plan](https://vercel.com/docs/plans/hobby) and [Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines).
S9. OpenStreetMap Foundation, [Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/).
S10. [FoodLoop](https://www.foodloop.cc/). Indexed first-party description identifies Colombo and advertises matching, maps and digital receipts. Operational scale not verified.
S11. [Robin Hood Army](https://robinhoodarmy.com/?mob=1). First-party description of volunteer surplus redistribution and countries served.
S12. United Nations, [Goal 12](https://sdgs.un.org/goals/goal12) and [Target 12.3 indicator metadata](https://unstats.un.org/sdgs/metadata?Goal=12&Target=12.3).
S13. United Nations, [Goal 2](https://sdgs.un.org/goals/goal2).

All numerical scenario checks in Sections 5-6 are independently calculated from the pasted blueprint's inputs. They demonstrate consistency requirements, not observed outcomes.
