# AgriLoop - complete AI-agent context

Version: 1.0. Updated: 24 October 2026. Project owner: Mohan / Team Fade. Local timezone: Asia/Colombo. Currency: LKR.

This is a self-contained project handover, not a declaration that implementation exists and not authorization to deploy, contact partners, spend money or run a food-distribution pilot. Follow the current user's task and higher-priority instructions. This file is ordinary project context, not an automatically installed AGENTS.md or system policy.

## Read this first

The owner explicitly confirmed these five decisions in the current conversation:

1. Stage: idea only. Do not claim an early prototype, repository, tested wireframes, live users, partners or revenue without new evidence.
2. Scope: both retail surplus and wholesale produce are included from the beginning. An earlier assistant recommendation for a retail-first scope was not adopted.
3. Transaction modes: discounted sales and free food donations.
4. Fulfilment: buyer/recipient collection. No AgriLoop delivery fleet or promised platform-arranged delivery in the initial agreed model.
5. Organization: a business with a free donation channel. A commission rate, subscription, payment method, company registration and sponsorship have not been selected or established.

The human-facing companion is `pdf/AgriLoop_Complete_Project_Guide.pdf`, relative to this file. The full guide text is included below, so you do not need the PDF or conversation to understand the project. A more detailed technical proposal follows the guide.

## Source precedence and interpretation

- Latest explicit owner decisions control project scope. Preserve the five confirmed decisions unless the owner changes them.
- Original external sources control factual claims within their documented scope; respect source discrepancies and verification limits.
- Supplied competition documents control their own instructions, but their deadline conflict is unresolved.
- The historical submission contains team-reported research, not authenticated raw observations.
- The earlier pasted blueprint and previous audit are historical context. Neither establishes completed software, real partnerships, pricing decisions or guaranteed marks.
- The operational and technical designs in this file are proposals unless explicitly identified as owner-confirmed. Do not convert a proposed field, policy, stack or milestone into a claim that the owner chose it.

## Never manufacture missing evidence

Do not invent interview quotations, exact fieldwork days, respondents, research instruments, safety tests, team biographies, mentor approvals, partner logos, regulatory approval, pilot activity or adoption results. Preserve the distinction between reported primary findings, verified source statements, hypotheses, targets and examples. Use `unknown` or an explicit unresolved status instead of a plausible-looking value.

Do not reuse 8-15% daily retail discard, 55-65% income share, >60% chemically safe Grade-B produce, 5,000 MT/day, universal 58% savings, zero logistics cost, zero friction, unique/first platform or elimination of stigma as established facts. Do not call all redistributed food a meal, all pickups consumption, or all transfers additional waste diversion.

Do not copy the owner's identity number or unconfirmed personal contact details into public artifacts. Use only confirmed team details. The full underlying survey export, audit logs, transcripts, implementation repository and agreements were not supplied.

## Current artifact and project state

Existing inputs are listed in the source map in the full guide. The 18 October verification report exists as `AgriLoop_Verification_Report.md` and `.pdf` beside this file. The originally supplied workbook and templates remain unchanged. There is no demonstrated application to patch. Inspect the actual workspace and any applicable instructions before beginning a later coding task.

The present task was documentation. The PDF gives a friend the entire project context; this Markdown gives an AI the same understanding plus requirements and implementation guidance. Do not mistake generated documentation, example data or a proposed architecture for implementation progress.

## Full project context

The next section reproduces the complete friend-facing guide. Read it before designing or editing the project.

---


# AgriLoop
## The complete project guide
For a friend joining the project | Team Fade | Version 1.0 | 24 October 2026

AgriLoop is an idea for a business that helps food vendors offer eligible surplus for discounted sale or free donation, with buyers and recipients collecting it themselves. It covers both small retail quantities and larger wholesale produce lots.

This guide explains the idea, the people involved, the proposed product, how the business could operate, the mistakes in earlier materials, and the evidence and work still needed. It is a project handover, not a claim that the service has already been built or tested.

CONFIRMED: idea stage; both streams; sales and donations; recipient collection; business with a free donation channel.
PROPOSED: detailed features, payment handling, launch process, technology, eligibility policies and revenue mechanisms.
UNVERIFIED: historical primary-research summaries without raw records, adoption, partner commitments and impact projections.

The latest owner decisions take precedence over earlier drafts. In particular, a retail-only launch is not the agreed scope, and an early prototype does not exist according to the owner's current statement.

---
# 01 | What is decided and how to read this guide
## The agreed foundation
The owner confirmed that AgriLoop currently exists only as an idea. The full concept must include retail surplus and wholesale produce from the beginning. Vendors can offer food through discounted sales and donations. Collection is the responsibility of the buyer or receiving organization. AgriLoop is intended to be a business with a free donation channel.

These decisions define the project. They do not establish a registered company, a working app, confirmed vendors, approved food-handling procedures or revenue. The terms business and platform describe the intended model.

## What free donation means here
The proposed operating interpretation is zero food price and zero AgriLoop transaction fee for a donation, for both donor and recipient. Collection, handling or packaging may still require resources. Disclose who supplies them; do not hide a mandatory platform charge inside the donation journey. If a future optional paid service is considered, it must not become a condition for accessing the free channel.

## What this guide adds
The workflows, feature priorities and build sequence are recommendations developed from those decisions. Where a policy remains unresolved, it is labelled as an open decision rather than silently presented as approved. The examples use invented quantities solely to explain a transaction; they are not pilot results.

Read chapters 02-08 to understand the service, 09-11 for product and business design, 12-14 for evidence and past mistakes, and 15-20 for measurement and execution. The glossary and source register support the whole guide. The companion Markdown contains this full context plus explicit instructions and a proposed technical specification for an AI agent.

## A shared vocabulary for status
- Confirmed decision: explicitly chosen by the project owner.
- Source-supported fact: accurately reflects a named external source and its original scope.
- Team-reported observation: stated in the submission but not independently authenticated.
- Proposal: a suggested design or operating choice that can be revised.
- Hypothesis: an explanation or expectation to test.
- Example or target: illustrative or future-oriented; never an achieved result.

The previous verification report remains useful history [L6]. Its recommendation to prioritize retail was not adopted as a scope decision. Both streams must remain visible in requirements, validation, costs and demonstrations.

---
# 02 | The problem and the intended contribution
## Why the idea exists
Earlier Team Fade materials describe unsold food at retail closing time and produce rejected or left unsold at wholesale markets, alongside difficulty affording food. The proposed opportunity is to make suitable surplus easier to discover, reserve and collect before the vendor's approved collection deadline. [L2]

Three distinctions matter. Food can be unsold without being safe to redistribute. Food can be safe but economically impractical to collect. A person can want discounted food without being able to reach the vendor at the required time. AgriLoop has to address these practical conditions rather than assume that a listing automatically creates a useful transfer.

## A defensible problem statement
Team Fade's preliminary submission reports unsold food and difficulties coordinating small-batch redistribution in Colombo and nearby areas. A documented study is needed to establish how much eligible surplus can reach nearby consumers and bulk recipients at an acceptable total cost, within suitable collection windows.

National food-insecurity figures establish context, not the size of AgriLoop's customer base. Likewise, chain-wide vegetable losses cannot be treated as the inventory available to this platform. The source review in chapter 12 explains which numbers can be used and with what qualifications.

## What the solution is intended to change
AgriLoop would provide a structured way for vendors to describe surplus, show availability, agree a sale or donation, reserve quantity and record collection. Consumers could find smaller offers nearby. Kitchens, canteens and other bulk recipients could find larger lots and arrange their own transport.

The underlying hypothesis is that better information and a simpler coordination process can make some transfers worthwhile. To test it, compare vendor effort, accepted quantities, completed collections and total costs with existing practices. The absence of an app is not itself a root cause.

## What the service does not automatically solve
It does not repair damaged produce, make unsafe food safe, provide refrigeration, guarantee transport, eliminate poverty, guarantee balanced nutrition or remove every source of stigma. The initial collection model does not include an AgriLoop delivery fleet. Buyers still face travel time and costs, while bulk recipients need suitable capacity.

The proposed pilot geography is Colombo/Dehiwala for retail and a reachable wholesale market such as Peliyagoda for bulk produce. These locations come from the earlier narrative; actual sites and permission remain to be agreed. Dambulla and upstream corridors are part of the broader context, not confirmed launch coverage.

---
# 03 | Two streams, one platform
Retail vendor -> AgriLoop listing/reservation -> consumer or recipient collection.

Wholesale supplier -> AgriLoop request/acceptance -> bulk buyer or recipient collection.

Both streams support discounted sales and free donations. These are proposed workflows under the confirmed model.
## Shared foundations
Both streams need vendor onboarding, listings, clear quantity units, sale or donation mode, collection instructions, reservation records, cancellation, handover confirmation and support. The commercial status of a transfer is separate from its stream: a retail bundle may be donated, and a wholesale lot may be sold at a discount.

This produces four supported combinations: retail sale, retail donation, wholesale sale and wholesale donation. They should share a consistent account and records system without forcing the same operational details onto all four.

## Retail stream
Retail typically involves small, defined bundles or portions offered by bakeries, cafes, cafeterias or other approved sellers. A buyer chooses an available quantity, reserves it and collects during a short published window. Donation recipients can collect eligible retail offers under the donation policy.

## Wholesale stream
Wholesale typically involves produce lots measured in kilograms or clearly specified containers. A canteen, kitchen or other approved bulk buyer or recipient requests a quantity, confirms collection capacity and arranges a vehicle if needed. The final accepted weight and any rejection need to be recorded.

## Important boundary
The two streams have different packaging, food-category, quantity, loading and scheduling needs. A student collecting a bundle and a kitchen collecting a large lot cannot be treated as the same journey. Both are in scope, but each must pass its own validation before live food transfers start. A paused stream remains part of the roadmap; it must not be advertised as operational until ready.

The diagram describes the agreed concept and proposed workflows. It is not a map of existing partnerships or a claim about current capacity.

---
# 04 | People, responsibilities and trust
## Vendors and donors
A participating vendor supplies accurate descriptions, available quantities, price or donation status, collection location and relevant handling information. The proposed onboarding process checks the business or organization and its authorized representative. Verification means specified checks were completed; it is not a promise that every listed item is safe.

The vendor should nominate someone who can approve listings, update availability and confirm handover. Staff roles need clear permissions. A vendor must be able to withdraw an offer promptly if food becomes unsuitable or stock information changes.

## Consumers and bulk recipients
An individual buyer selects and collects a retail offer. A bulk buyer or recipient confirms its capacity to collect, handle and use the requested quantity. A nominated collector may act for an organization through an explicitly authorized pickup process. Exact authority and contact details should be available only to people involved in the transfer.

Potential bulk participants include community kitchens, welfare homes, student canteens and other appropriate organizations. Their participation is proposed, not secured. Do not use the names of major supermarket or bakery chains as partner logos without permission and an actual relationship.

## AgriLoop's operating team
The team manages accounts, vendor review, disputes, system reliability, records and the commercial model. It should provide a reachable support contact and a process for withdrawing listings, contacting affected recipients and preserving incident records. Calling the platform an intermediary does not by itself resolve legal responsibilities; those need local advice and appropriate agreements.

## Role separation
Distinguish the merchant who posts, the person who pays, the organization that receives and the person who physically collects. One person may hold more than one role, but the records must show who did what. Keep private contact details out of public listing descriptions.

## People still missing from the evidence
The previous submission's farmer perspective comes through intermediaries, not documented direct farmer interviews. The project also needs practical input from bulk recipients, vendor closing staff and an appropriate food-safety advisor. A project mentor can help with architecture or research, but does not automatically provide regulatory approval.

Team membership, individual skills, degrees and mentor names are not filled in here because the supplied files do not substantiate the detailed roster in the pasted blueprint. Assign work by function until the actual team confirms ownership.

---
# 05 | Retail sale: an end-to-end example
## Illustrative journey, not a real transaction
An approved bakery has six eligible bundles available. Each bundle has a defined contents description and an example price of LKR 250. The vendor publishes the collection window and required food information. These example values are not observed prices, confirmed inventory or safety recommendations.

1. The vendor creates the offer and confirms its quantity, unit, sale mode, price and collection conditions. The system checks required fields and the applicable eligibility policy before publication.
2. A buyer searches a list of nearby offers, opens the details and sees the total payable amount and collection requirements before reserving.
3. The buyer reserves one bundle. The platform reduces the available quantity atomically, so simultaneous buyers cannot claim the same final unit.
4. The buyer receives a reservation reference and collection instructions. A QR code can be a convenient way to present the reference, but the server record determines validity.
5. At collection, the vendor checks the active reservation and the buyer inspects the offered food against the description. The agreed payment process is completed or recorded.
6. The vendor confirms the actual handover. Both parties receive a record; the platform counts a completed transfer only at this point.

## Payment is a separate design decision
Cash-on-collection is a proposed first-pilot option because it avoids building a payment gateway immediately. It has not been selected by the owner. If used, the platform records merchant confirmation rather than pretending it independently processed or verified the money. Online payment requires a separate settlement, refund and failure-handling design.

## Exceptions that must be designed
If the buyer cancels, release inventory only while the listing is still eligible and available. If the vendor cancels, notify the buyer and explain the next step. If the buyer does not arrive, expire the reservation without marking a collection. Re-offer only if permitted by the food protocol and remaining window.

Do not change price, ingredients or other material terms after reservation without obtaining the buyer's agreement or cancelling appropriately. If the buyer rejects the food at handover, record the reason and outcome. A sale reservation is not proof of a sale, a handover or consumption.

## What this tests
Can staff post accurate offers during a busy period? Can nearby buyers actually arrive? Does net buyer saving remain useful after travel? Can vendors recover value without excessive effort? These questions matter more than whether a screen looks polished.

---
# 06 | Wholesale produce: an end-to-end example
## Illustrative bulk transfer
A wholesaler lists an example lot of 80 kg of produce. An approved kitchen requests 30 kg. The request and values are fictional explanations of the workflow, not validated demand or recoverable volume.

The listing needs commodity, unit, estimated quantity, condition description, location, loading instructions, collection period, sale price per unit or donation status, and any minimum lot size. Cosmetic description must not be used as a substitute for food eligibility.

1. The wholesaler posts a lot with the information required by the approved policy.
2. The kitchen reviews its storage, preparation and collection capacity, then requests a quantity and collection slot.
3. The proposed first version uses vendor acceptance for bulk requests. Accepted requests reserve stock; unaccepted requests do not guarantee availability. The interface must make this distinction clear.
4. The recipient arranges its own suitable transport and identifies an authorized collector. AgriLoop provides coordination and records, not a delivery promise.
5. At pickup, both sides confirm condition, accepted quantity and any rejected quantity. For sales, the agreed final price follows the accepted quantity and agreed pricing rule.
6. The recipient confirms receipt. The lot and reservation are closed or updated with the remaining quantity. A receipt records actual weight, measurement method and the parties involved.

## Variable weight and partial acceptance
Estimated weight and actual accepted weight are different fields. If 30 kg was requested and only 27 kg is accepted, record 27 kg transferred and the reason for the difference. Do not silently charge for 30 kg, count 30 kg as impact, or automatically relist rejected stock.

Use a lot identifier so several recipients can receive portions of the same original lot without double-counting the supply. Define how boxes or crates relate to net food weight; never assume a standard kilogram conversion without a measurement.

## Logistics still exist
The kitchen bears the collection arrangement, but its costs influence whether the platform is useful. Measure travel, loading time, containers, handling and staff time. Determine whether a recipient can realistically use the food before accepting the donation or purchase.

Wholesale and retail should both appear in the prototype demonstration. Live wholesale transfers should begin only when actual supplier access, receiving capacity and handling arrangements are established. The second stream must not be reduced to a decorative slide with no working process.

---
# 07 | Donations and a sustainable free channel
## What is confirmed
The owner chose a business with a free donation channel. Donations are an integral transaction mode across the concept, not a later charity feature added to the closing slide. A donor can offer eligible retail food or wholesale produce without charging for the food.

The working design is that AgriLoop does not charge a donation transaction fee. Recipients arrange collection. The app must distinguish that free transfer from a commercial discount, and should not count both as the same financial event.

## Proposed first operating policy
Begin donation onboarding with identified organizations or otherwise approved recipients whose collection and receiving arrangements can be checked. This is a recommendation, not a final restriction to organizations. Whether individual recipients can claim donations directly remains an owner decision.

Show food details and collection requirements before acceptance. Avoid public labels that identify an individual as poor or food insecure. Recipient vetting should establish operational suitability without demanding unnecessary sensitive documents or collecting more personal data than the process needs.

## Allocation when demand exceeds supply
Choose and publish an allocation rule. Options include first eligible request, vendor confirmation, or scheduled rotation among approved organizations. Do not allow hidden favoritism or assume that the fastest smartphone user is the person with the greatest need. Record decisions and monitor repeated no-shows before considering proportionate restrictions.

## No-show and withdrawal
Use reminders and a clear cancellation route. A donor can withdraw food that becomes unsuitable. If a recipient cannot collect, the team may re-offer it only within the applicable handling rules and remaining window. A food shortage or safety concern must take priority over completing a donation target.

## How the free channel is funded
Commercial contribution, confirmed sponsorship or a defined operating budget could support moderation and donation coordination. None of those sources is secured today. Keep a separate view of the cost of donation operations so the business understands the subsidy required.

The initial scope concerns food donations, not collecting cash donations, issuing tax receipts or certifying charitable deductions. Those would introduce separate requirements and are not agreed features. A transfer receipt should state what changed hands; it should not imply a tax or legal status it has not established.

---
# 08 | Food eligibility, incident handling and boundaries
## The safety boundary comes before listing
AgriLoop cannot establish chemical or microbiological safety from a photograph, cosmetic grade, QR code or timer. The previous universal three-hour window was not justified. Do not replace it with another universal app rule. Food categories, storage conditions and handling history differ.

Sri Lanka's Food (Hygiene) Regulations address food establishments and handling activities. They are a relevant starting source, not evidence that this proposed platform is compliant. A qualified local advisor should help define applicable obligations and practical procedures before a live food pilot. [S5]

## Proposed operating controls to develop
Define approved and excluded categories; required preparation or receipt information; storage and handling records where needed; ingredients and allergen information where applicable; packaging arrangements; collection deadlines; and rejection criteria. The system must be able to block a category or vendor pending review.

Store the food-policy version that applied when an offer was published. A listing should stop accepting reservations when its eligibility or collection window ends. A reservation must not extend the food's eligibility window simply because a buyer clicked in time.

## Separate different concepts
The reservation timeout controls stock availability. The pickup window controls when the vendor can hand over food. The food-eligibility cutoff reflects the approved protocol. These may overlap, but they are not the same clock. Do not let a developer collapse them into a single arbitrary expiry field.

## Handover and complaints
The collector should be able to reject an offer that does not match its description or appears unsuitable. Capture the outcome without pressuring someone to accept food to preserve a completion rate. Provide a visible contact channel for concerns after collection.

For a reported problem, the proposed process is to identify the lot, suspend affected listings, notify the responsible operator, preserve records, contact affected parties as appropriate and follow the advisor-approved response process. Define escalation responsibilities before launch. The team should not make medical judgments through the app.

## Packaging and responsibility
The old blueprint promised sealed packaging and customer containers simultaneously. The appropriate option depends on the category and the agreed handling process. Document who supplies containers and any disclosed costs. Do not promise zero packaging waste or universal bring-your-own-container support.

The commercial terms, donor terms and recipient instructions must reflect actual operations and locally reviewed responsibilities. A disclaimer does not replace those controls. This guide proposes an operational checklist; it is not a compliance certification or food-handling manual.

---
# 09 | What the first product should contain
## Minimum viable product for both streams
A minimum viable product is the smallest coherent version that can test the concept. It should support both retail and wholesale journeys and both sale and donation modes. It does not need every feature named in the earlier blueprint.

The vendor workspace needs an account, approval status, listing creation, stock updates, reservations or bulk requests, handover confirmation, cancellation and records. Templates can reduce repeated typing, but sellers must confirm changing details such as quantity and time.

The buyer or recipient workspace needs discovery, filters by stream and transaction mode, clear units and price, details, reservation or request, collection instructions, cancellation, pickup reference and help. Wholesale recipients also need quantity requests and collector information.

An administrator needs review queues, vendor and recipient controls, listing suspension, incident and dispute records, an audit trail and exports. Admin access is a real operational role; it is not a substitute for doing fieldwork or resolving every dispute automatically.

## Design choices recommended for the pilot
Start with a mobile-friendly web experience and a usable list view. A map can help discovery but must not be the only route to information. Display local dates and times clearly, offer address-based search where feasible, and do not require continuous location tracking.

Use clear distinctions between requested, accepted, reserved, ready to collect, completed, cancelled and expired. Show actual availability rather than a vague claim that food is guaranteed. Explain who collects and who pays before confirmation.

## Accessibility and dignity
Sinhala, Tamil and English are proposed language goals, not completed features. Test wording with actual users. Make forms readable, buttons accessible and errors understandable. Consider low bandwidth, shared devices, disability access and people unable to collect late at night.

Display normal purchase and donation information without public labels about financial hardship. Privacy-preserving design can reduce exposure, but whether it reduces stigma is a research question rather than an assured benefit.

## Defer until justified
AI price prediction, automatic dynamic discounts, automated delivery routing, a delivery fleet, gamified impact rankings and complex loyalty systems are not required to establish the basic concept. Automatic sale-to-donation conversion also needs vendor consent and a complete policy before implementation. Keep these as optional future ideas, not hidden MVP commitments.

---
# 10 | Technical design in plain language
Proposed architecture: vendor/recipient web interface -> application server with rules and permissions -> database for stock and transfers. Admin operations and notifications use the same authoritative records.
## Proposed architecture, not an existing implementation
A mobile-friendly web app talks to a server that checks permissions and applies business rules. A database stores accounts, listings, stock, reservations, transfers and incidents. Notification services send reminders. An admin interface supports operations. This is a suggested starting architecture, not an approved technology purchase or a built system.

Choose one application approach. A React/Next.js progressive web app is a reasonable proposal; a React Native mobile app is a separate choice, not another name for the same thing. PostgreSQL, potentially through Supabase, is one database option. The team should confirm the stack after reviewing skills, costs and requirements.

## What must be reliable
The server must control stock and prices, verify the collector or reservation, enforce expiry and prevent repeat handover. Two simultaneous buyers must not reserve the last unit twice. A vendor must not view or change another vendor's private records. Retried requests must not create duplicate transfers or fees.

QR codes identify reservations; they do not prove safety, payment, weight or consumption. A single server-side redemption record should determine whether a reservation has already been used. Store actual handover quantity separately from the original request.

## Connectivity and maps
The proposed pilot permits cached browsing with a clear stale-data notice, but requires an authoritative check for final reservation and redemption. Offline token caching alone cannot prevent two disconnected devices from accepting the same token. Any manual fallback needs one controlled record and reconciliation.

Maps, map data, geocoding and map tiles are separate services. OpenStreetMap's public tile service has usage limits and does not permit bulk offline downloading. Choose a suitable provider and include its cost and attribution requirements. [S8]

## Data and maintenance
Keep an audit trail for material changes; restrict access; protect secrets; back up records; test recovery; and assign someone to monitor failures. Location and account-linked tokens are not anonymous merely because they omit a person's name. Define data retention and contact consent before using real participant data.

Detailed proposed records, state transitions and acceptance tests appear in the companion AI Markdown. They are design guidance for future implementation, not proof that the system exists.

---
# 11 | How the business could support itself
## Confirmed model, unchosen pricing
AgriLoop is intended to earn revenue while providing a free food-donation channel. The owner has not chosen a commission rate, subscription price, payment provider or paid service package. The previous 5% commission is only a scenario to examine, not an approved commercial decision.

Possible revenue options include a fee on completed commercial transfers or an optional vendor subscription for useful business tools. Sponsorship could support the free channel if actually secured. Evaluate these alternatives with vendors; do not combine every option into a complicated first product.

## Proposed commission flow
If commercial transfers use cash-on-collection, money goes from the buyer to the vendor. AgriLoop would need a separate, agreed method to collect its fee, such as periodic merchant invoicing. The records must distinguish fees due, invoiced, collected and refunded. A recorded sale is not automatically cash in AgriLoop's bank account.

If payments are processed online later, gateway costs, settlement delays, failed payments and refunds must be handled explicitly. Donation transfers should not pass through a payment flow that imposes a platform charge. The exact refund and fee-reversal policy is an open decision requiring an operational and legal review.

## Unit economics: an illustration
At a hypothetical 5% rate, a LKR 250 completed sale creates LKR 12.50 of gross platform fee before costs or collection losses. A LKR 200 sale creates LKR 10. Those small amounts must support messaging, support, hosting, administration and the cost of collecting the fee. They are not profit.

Monthly contribution can be modelled as collected commercial fee revenue minus variable transaction costs minus fixed operating costs minus the donation-channel operating subsidy. Use separate figures for the number of completed transfers, average sale value, fee rate and fee-collection success. Do not multiply retail meal counts by wholesale prices.

## Budget honestly
The old estimate of LKR 35,000 adds correctly: 12,000 hosting, 8,500 onboarding and 14,500 field logistics/packaging. No quotes establish those costs. It also mixes a two-month hosting period with a three-month pilot and different outlet counts. Replace it with one phase-specific budget, including unpaid labor as an explicit contribution. [L6]

Hosting free tiers are not a sustainable business assumption. Vercel's Hobby documentation restricts that plan to personal, non-commercial use. Confirm suitable services and limits before launch; do not claim that open-source components eliminate all foreign-currency costs. [S7]

Keep donation operating costs visible. Commercial income may eventually support them, but the project currently has no demonstrated revenue or committed sponsor.

---
# 12 | Evidence we can use, and its limits
## National context
BRIGHT's Table 2 reports 32.8% of Sri Lankan households experiencing moderate or severe food insecurity in the 2024-2025 survey, with a 12-month recall period; the urban estimate is 35.3%. These are households, not the percentage of all people or students, and not a fresh October 2026 measurement. [S1]

The source itself has inconsistencies: its narrative gives 35.5% urban, while its table and chart give 35.3%. Its table gives 29.6% moderate and 3.1% severe nationally, not the pasted analysis's 3.2%. Use the table/chart, preserve the reported total, and acknowledge the discrepancy. IFPRI's catalogue and the retrieved PDF also differ on the project-note number, so cite title, authors, year and link. [S1, S2]

## Food loss and waste
HARTI's catalogue identifies Report 217 (2018) as Quality and safety issues in fruit and vegetable supply chains in Sri Lanka: a review. The earlier blueprint attached the wrong title. The exact passage supporting the proposed 20-40% range remains unverified because the full report could not be retrieved during the previous review. Do not use that range as daily local edible disposal. [S3, L6]

The Colombo paper is by Maren Reitemeier, Mohamed Aheeyar and Pay Drechsel. Its introduction attributes about 42% of Colombo food waste to restaurants, markets and abattoirs/meat shops, citing earlier research. It is not 42% of institutional waste or a measured recoverable-food percentage. [S4]

## Team-reported research
The submission reports four vendors, three bakery/cafeteria managers, a 42-person survey, two commission agents, a driver and a kitchen coordinator. It reports 15-30 unsold bakery items, 40-70 kg/day market discards, and survey percentages of 78.6% and 83.3%. Raw responses, audit logs and transcripts were not supplied. Treat these as reported findings requiring records, not authenticated results. [L2, L6]

The percentages are compatible with 33/42 and 35/42 under complete unweighted responses, but arithmetic cannot authenticate the survey. Intent to buy does not prove collection, repeat use or reduced stigma. Three managers expressing willingness do not establish national vendor adoption.

## Evidence needed next
Recover the survey instrument, response export, sampling method and actual dates. Record whether market quantities were weighed or recalled, and distinguish total discards from eligible surplus. Preserve source links and exact supporting passages. If old records cannot be recovered, describe the limitations and conduct a new documented study rather than reconstructing evidence from the desired story.

---
# 13 | Earlier mistakes and the correct replacement
## Claims became stronger than their evidence
The original submission mixed whole-chain losses with daily urban discards, households with population, and stated interest with proven adoption. The pasted revision recognized some problems but added unsupported precision and promises. The correction is not to make the language more persuasive; it is to align every claim with what was actually observed or sourced. [L1, L2, L6]

Replace “verified root cause” with “working hypothesis” where cost and behavior have not been measured. Replace “chemically safe Grade-B produce” with a condition description and a separate eligibility assessment. Replace “zero logistics cost” with “buyer or recipient arranges collection.” Replace “eliminates stigma” with a user-experience goal to test.

## Unsupported details must not become project history
The pasted blueprint includes a verbatim bakery-manager quotation, exact October fieldwork dates, detailed team roles, mentor advice, a GitHub scaffold, merchant-tested wireframes and an early prototype. The supplied records do not substantiate those details. The owner's latest statement confirms idea stage. Do not repeat completed-build claims. [L6]

October 2026 is given as the research month in the submission, but specific days require records. The cover is dated 12 October and the declaration 8 October. Resolve the chronology before reusing the declaration; do not backdate it. Confirm the roster, contact details and mentor involvement directly, and omit private identity numbers from public project material.

## Citation corrections
Use the actual HARTI title and actual Colombo-paper authors. Do not attribute the BRIGHT survey to FAO merely because it uses FAO's scale. WFP and CBSL source labels must point to specific findings; they do not support assertions about soup-kitchen stigma or volunteer response time. [S1-S4, L6]

## The score and the evaluator
The evaluation records 63/100: context 11/15, root causes 8/15, evidence 13/20, stakeholders 10/15, methodology 9/15, insights 6/10 and problem statement 6/10. The arithmetic is correct; the team's self-assigned 100/100 is not an official result. Workbook provenance cannot be authenticated from its filename alone. [L1, L6]

The workbook says its totals and checks calculate automatically, but inspection found fixed values and no formulas. Its current total is correct, but edits could leave it stale. The evaluator also missed the source's urban-statistic inconsistency. Use the evaluation as feedback, not an unquestionable scientific source.

No revised narrative guarantees maximum marks. Better evidence, a narrower claim and an honest explanation are more defensible than promises that judges cannot deduct points.

---
# 14 | Numbers that must be repaired before reuse
## Price and savings
The old LKR 550-750 baseline and LKR 200-250 proposed price do not imply one universal 58% saving. Comparing endpoints gives 54.5% to 73.3%; comparing midpoints gives 65.4%. The ranges describe scenarios until matched products and real prices are documented. [L6]

Savings should compare equivalent quantity and quality, then deduct incremental collection costs where relevant. Gross price differences of LKR 300-550 do not establish savings above LKR 500 every day. A five-item bundle is not automatically a complete meal.

## Food quantity and impact
The old target of 160 kg per month per vendor, multiplied by 15 vendors and three months, equals 7,200 kg. It does not equal 7,200 meals without a defensible conversion. At 250 vendors, the same monthly rate gives 40 MT, not 45 MT. Additional wholesale volume could change the total, but must be shown explicitly.

At 30 operating days, 160 kg/month is 5.33 kg/day. If vendors list on 60% of days and 80% of listed quantity is claimed and collected, the required listed-day quantity is 11.11 kg. The earlier observation of 15-30 items does not establish that mass.

The proposed 3 MT/month wholesale target implies 100 kg/day over 30 days. It needs actual recipient capacity, suitable collection and an observed supply base. The claims of 1,200 active users, 7,200 meals and 35,000 future beneficiaries lack a validated acquisition or capacity model.

## Commercial arithmetic
At the old hypothetical 5% fee, recovering a LKR 35,000 budget would require 2,800 sales at LKR 250 or 3,500 at LKR 200, before any other costs. A fee-free pilot cannot fund itself through those commissions during the free period. This illustration does not select a fee rate or establish profitability.

## Baselines and scope
Zero AgriLoop-mediated collection before launch does not mean all surplus was previously discarded. Vendors may already discount, donate, feed staff or use other destinations. Establish a baseline for eligible surplus and current destinations.

Keep sales, donations, retail portions, bulk kilograms, people and transactions separate. Never add quantities with different units, treat reservations as collections or count a wholesale lot twice when both supplier and recipient acknowledge the same transfer. Any future model should display its input assumptions, time period and measurement method beside its outputs.

---
# 15 | How success should be measured
## Operational measures
Track active participating vendors using a stated definition, eligible quantity listed, reserved quantity, completed quantity, cancellations, no-shows and unresolved complaints. Keep retail and wholesale results separate, and split sales from donations. Record the exact observation period and denominator for every rate.

A collection rate could mean completed reservations divided by accepted reservations due within that period. A quantity recovery rate could mean collected eligible kilograms divided by eligible kilograms offered. Those are different measures. Exclude not-yet-due reservations from a finalized completion rate or disclose their treatment.

## Buyer and vendor outcomes
Measure actual purchase value, equivalent reference price, buyer travel cost, collection time and repeat collection. For vendors, record listing time, support effort, recovered revenue and any additional handling costs. For recipients, measure whether quantities fit actual receiving and use capacity.

Use short voluntary feedback rather than assuming that app use establishes food insecurity or nutritional improvement. Do not require sensitive hardship disclosures to make a purchase. If evaluating household food access, design that research separately with appropriate methodology and consent.

## Additional food diversion
Completed transfers establish handover, not necessarily food consumed or waste prevented. Compare with documented previous destinations and ask receiving organizations about use and rejection where feasible. Report transferred food separately from estimated additional diversion. Keep measurement uncertainty visible.

Record actual net food weight where possible. If an estimate is needed, mark it as estimated and explain how it was obtained. Do not multiply a QR scan by a fictional standard meal weight. Store a lot identifier so bulk splitting does not inflate totals.

## SDG contribution
Targets 12.3 and 2.1 are relevant to waste reduction and food access. Project-level kilograms and savings can demonstrate contribution, but are not the official food-loss/waste indices or national food-insecurity prevalence. Discounted bakery items do not by themselves prove better nutrition or poverty reduction. [S9, S10]

## Proposed pilot acceptance principles
Before testing, agree practical thresholds for completed collection, vendor effort, record completeness and buyer value based on observed conditions. Record all failures, not just successful demonstrations. Require correct quantity control, rejection of duplicate redemption, a working withdrawal process and usable support before expanding. Any unresolved serious safety concern requires operational review regardless of how attractive the growth numbers look.

The team has not selected numerical success thresholds. Set them before collecting pilot outcomes to avoid choosing a favorable definition afterward.

---
# 16 | Validation plan for both streams
## Stage A: recover and organize existing evidence
Create a claim register. For each statement record its exact wording, source, date, geographic scope, denominator, evidence status and permitted use. Separate raw research from summaries. Confirm who collected it and whether participants consented to the intended use. Missing records must remain missing, not be reverse-engineered.

## Stage B: understand actual operations
Observe willing retail vendors across more than one relevant trading day, including low-surplus days. Record what remains, whether it meets the proposed eligibility policy, current destinations, closing duties and realistic collection windows. Interview counter staff as well as managers.

For wholesale, observe lots, weighing, minimum quantities, collection access, rejection reasons and recipient capacity. Speak directly to recipients about transport, staff, storage and what kinds of produce they can use. Intermediaries can describe their own experience but do not substitute for direct farmer testimony on farmer-specific claims.

## Stage C: test the coordination process manually
After agreeing the operating protocol, run a small controlled coordination test for each stream with consenting participants. Record the offer, request, acceptance, collection outcome, time and actual quantity. A manual test can reveal whether the process creates value before the team invests in advanced software.

Do not invent a fieldwork date or assume recruitment is representative. Choose a feasible number of participants with the team and report it honestly. A small purposive study can help design the pilot but does not justify a national adoption percentage.

## Stage D: test software against real problems
Use synthetic records for initial interface and reliability tests. Then, once the relevant permissions and operating controls are ready, test the complete retail and wholesale flows with participants. Include a no-show, cancellation, unavailable stock and partial bulk acceptance rather than demonstrating only the ideal path.

## Stage E: decide whether to expand
Compare results against the pre-agreed measures. Expand only where participants can collect, vendors can operate the process and the cost model is workable. If one stream is not ready, document why and keep its requirements active instead of quietly removing it from the concept.

The main assumption is not simply whether staff can tap a button quickly. The whole chain must work: suitable supply, timely information, an interested recipient, feasible collection, acceptable cost and a reliable handover. An attractive app cannot compensate for a broken step in that chain.

---
# 17 | Development roadmap with both streams in scope
## Phase 1: agree the operating design
Confirm a small set of food categories and sites, recipient policy, payment approach, support ownership and collection rules. Map all four combinations: retail sale, retail donation, wholesale sale and wholesale donation. Draft example records and exception handling before designing screens.

Exit condition: the team can explain a complete transaction and its failures in each combination without relying on an unchosen policy or a nonexistent partner. Live handling still requires the appropriate review and participant arrangements.

## Phase 2: build a concept prototype
Create the discovery, listing, reservation, bulk request, handover and admin views with synthetic data. Implement one authoritative inventory and transaction model. Clearly label demo users, inventory and impact figures so screenshots cannot be mistaken for real traction.

Exit condition: a viewer can follow both streams, understand sale versus donation, and see what happens on cancellation, expiry and partial acceptance. This is the first point at which a working prototype can truthfully be claimed.

## Phase 3: complete the operational MVP
Add account permissions, vendor review, stock concurrency, single-use redemption, notification failure handling, actual quantity records, support and audit logs. Implement the selected commercial accounting method. Provide exports and backup/recovery arrangements appropriate to the pilot.

Exit condition: acceptance tests pass for the chosen deployment, operations can manage withdrawals and incidents, and no unresolved critical issue is hidden by a successful demo.

## Phase 4: controlled field pilot
Run small tests of both streams with actual approved participants and record every outcome. The participant count, duration and budget must be chosen from real capacity; the earlier 15-vendor and 1,200-user numbers are not commitments. Evaluate donation costs separately from commercial revenue.

## Phase 5: improve and expand
Use measured evidence to decide whether to add more vendors, categories, recipients, geography or online payments. Larger wholesale volumes may need more coordination even under recipient collection. AI features and dynamic pricing should solve a demonstrated problem rather than decorate a pitch.

## Suggested sequence within a four-week build period
If the team later commits to four weeks: week 1 covers workflows, schema and prototypes for both streams; week 2 builds shared accounts, listings and reservations; week 3 implements bulk acceptance, donations, handover and admin operations; week 4 focuses on reliability tests, documentation and demonstration. This is a suggested schedule, not a delivery promise or a confirmed competition calendar.

Do not delay the wholesale data model until after retail is complete. A shared foundation can be built sequentially while preserving both-stream scope throughout.

---
# 18 | Risks, exceptions and practical improvements
## Supply and adoption
Surplus may be unpredictable, vendors may forget to post, and recipients may be unavailable when food appears. Test advance preparation of listing templates, sensible reminders and realistic collection windows. Do not post guaranteed future stock unless the vendor actually commits it. Monitor whether repeated discounts encourage excess production or displace normal sales.

## Collection failures
No-shows, unsafe travel times, loading delays and insufficient transport can invalidate a good match. Use clear collection instructions, cancellation, capacity confirmation and authorized collectors. Consider limits on simultaneous reservations and proportionate responses to repeated misuse; allow review when circumstances are outside a user's control.

## Inventory and abuse
Duplicate reservations, replayed QR codes, false handover reports and misleading original prices can distort both revenue and impact. Use transactional stock control, one-time server confirmation, change logs and an issue-reporting route. Preserve the originally agreed price and description rather than rewriting history after collection.

## Safety and privacy
Misdescribed food, incomplete handling history and weak recall procedures need an operational response, not only an app warning. Do not minimize risk through unsupported “low likelihood” labels. Protect private contact and location data, limit staff permissions and define how complaints are handled without exposing participants publicly.

## Financial sustainability
A low commission can be outweighed by support and collection costs. Cash sales can go unreported; sponsorship can fail to materialize. Track actual fee collection and the cost of the free channel. Revisit pricing with participants using measured costs rather than promising permanent financial viability from a spreadsheet scenario.

## Specific additions worth prioritizing
- A lot-based traceability record linking supplier, listing, recipients and actual transferred quantities.
- Clear states for requested, reserved, collected, cancelled and expired, with reasons.
- A recipient-capacity field for bulk transfers and an authorized-collector process.
- A vendor withdrawal control and an incident queue visible to a responsible operator.
- Separate reports for commercial value, donation quantity and additional diversion estimates.
- An accessible list view and a controlled support-assisted route for users who struggle with the app.

These additions protect the basic workflow. They are more immediately useful than price prediction, elaborate rewards or claims of artificial intelligence. The proposed features still require team prioritization and testing; this document does not mark them as implemented.

---
# 19 | Competition context and honest communication
## What the supplied materials require
The concept-deck template calls for deleting its instruction slide, retaining 12 core slides in order, and using at most two appendices. It requires sources, body text at least 14 pt, and truthful labels such as Done, In progress and Planned. The specified filename is TeamName_SubmissionNo_ConceptDeck.pdf. The ten timed sections total approximately eight minutes. [L5]

This handbook is background documentation for a friend and an AI agent, not the required concept deck. Do not submit it as if it satisfied the slide structure. Derive a concise deck from it later, with actual visuals and a timed rehearsal.

## Deadline conflict remains open
The supplied template prints 29 October 2026 at 11:59 p.m., while the handbook gives a concept-deck window ending 3 November and says dates may change. As of this document, no definitive updated organizer notice has been established. Work toward the earlier printed date until the organizer confirms the deadline and timezone. [L4, L5]

The handbook lists a later prototype-development period and a separate final-showcase format. Do not confuse the final-showcase five-minute pitch with the template's eight-minute concept pitch. A proposed internal four-week plan does not override official dates.

## Registered IDs and SDG targets
The submission lists problem IDs [2.2], [12.2] and [1.3]. Their problem-pool definitions were not supplied. Retain the registered identifiers, but do not assume they are the UN target numbers. Explain the actual SDG contribution separately using appropriate target references. [L2, S9, S10]

## Prior art and differentiation
The idea adapts a known surplus-food coordination pattern. Too Good To Go's official store terms cover several types of suppliers and specify commercial fees through account terms; they do not support a universal 25-30% fee claim. [S6]

Earlier research also identified FoodLoop and Robin Hood Army as relevant local or regional comparison leads. Their public descriptions are not proof of operating scale. Compare named services and actual features, record the date and scope of the search, and do not claim AgriLoop is the first or only local solution. [S11, S12]

The proposed differentiators are the two-stream workflow, local collection model, free donation channel and attention to bulk recipient capacity. They become meaningful advantages only if users value them and the process works. Do not list unperformed patent or academic searches as completed research.

---
# 20 | Decisions still open and what to do next
## Owner decisions still needed before implementation
Choose the first sites and food categories with operational input. Decide whether donations are initially limited to approved organizations or also available to individuals, and how scarce donations are allocated. Select a payment approach, revenue mechanism, fee collection process and cancellation/refund policy. Confirm the technology, operating budget and named responsibilities.

The model's five confirmed decisions are not open questions: idea stage, both streams, sale and donation, recipient collection, and business with a free donation channel. Future work should not repeatedly ask the owner to reconfirm them without a material reason to revisit the model.

## Immediate work by function
The project lead should confirm registration details, competition dates, team membership and who owns each decision. The research owner should recover primary records and maintain the claim register. The operations owner should speak to actual vendors and bulk recipients and arrange appropriate safety advice. The product owner should map the four transaction journeys and failures. The engineering owner should select the stack and build against those agreed workflows. One person may cover several functions.

## Before saying the concept is validated
Show evidence of eligible supply, recipient demand at the relevant time, feasible collection and acceptable cost. Record actual transfers and failures. Separate positive interview responses from real behavior. State the sample, site and period rather than generalizing to all of Sri Lanka.

## Before saying the product is ready
Demonstrate both streams and both modes with correct quantity handling, single-use pickup verification, cancellation and incident support. Show that real users understand the interface. Confirm operational controls, ongoing ownership and suitable hosting. A successful screen recording alone is not a launch-readiness test.

## How a friend can help immediately
Read the confirmed model first, then check whether each proposed workflow matches real vendor and recipient behavior. Challenge unsupported promises and unexplained numbers. Help recover evidence, find willing participants, simplify the first build or review the prototype. Keep suggestions separate from decisions until the team adopts them.

## How to keep the documents accurate
Update the version date, decision log and evidence register whenever a material fact changes. Record who approved a policy and where results are stored. Replace “planned” with “done” only when an artifact or test supports that change. Preserve earlier source files; corrections should not erase the history of what was submitted.

AgriLoop's strongest next step is a credible, observable process for both streams. The documents should make that process understandable and testable, rather than making the idea look more mature than it is.

---
# 21 | Glossary and source map
## Terms used throughout
- Surplus: food beyond expected demand; not automatically eligible for redistribution.
- Eligible food: food meeting the agreed category-specific operating protocol.
- Retail bundle: a defined group of items, not necessarily a complete meal.
- Wholesale lot: an identifiable bulk quantity that may be split among recipients.
- Donation: a free food transfer; collection still requires resources.
- Reservation: quantity committed to a request, not a completed handover.
- Handover: a recorded physical transfer of the accepted quantity.
- Baseline: the situation before or without intervention, within a defined scope and period.
- Additional diversion: food kept from its previous waste destination because of the intervention.
- Unit economics: revenue and costs per transaction or other meaningful unit.
- MVP: the minimum viable product that tests a coherent service with users.
- Pseudonymous data: identifier-linked records that may still identify a person.

## Supplied evidence and project history
L1. Fade_Submission1_Evaluation_Final.xlsx. All four sheets reviewed 18 October; source unchanged.
L2. Team_Fade_Problem_Validation_Submission (1).pdf. Sections 1-9; reported findings, not raw records.
L3. Problem Validation Submission Template-B_ro2dUj.docx. Structure and seven-criterion rubric.
L4. SDG Solutions Challenge 2026 Handbook.docx-C2yKyJ3Y (1).pdf. Roadmap and weights.
L5. SDG Sprints 2026 Solution Concept Deck Template-BdR3L98D.pptx. Instructions and prompts.
L6. AgriLoop_Verification_Report.md/.pdf, 18 October 2026, output folder. Previous analysis, not primary research.
L7. Pasted blueprint in the conversation. Proposed content requiring verification.
L8. Owner decisions confirmed 24 October 2026. These control the current scope and stage.

No raw survey export, interview transcript, field log, partner agreement or implementation repository was supplied for this handover. Research claims remain qualified accordingly. This document intentionally omits identity numbers and unconfirmed contact information.

---
# 22 | External references and verification limits
## Research and context
S1. D. Headey and colleagues, Food insecurity in post-crisis Sri Lanka: Evidence from the 2024-2025 BRIGHT survey, 2025. [Direct PDF](https://cgspace.cgiar.org/server/api/core/bitstreams/3714264a-7860-4a77-b9dc-1dffb100e327/content). Table 2 and Figure 1; source inconsistencies are noted in chapter 12. Reviewed 18 October 2026.
S2. IFPRI, [BRIGHT Sri Lanka project and publication catalogue](https://www.ifpri.org/project/bright-sri-lanka/). Reviewed 18 October 2026.
S3. HARTI, [research-report catalogue, Report 217](https://www.harti.gov.lk/publications.php?author=&category=research_reports&page=6&publish_year=). R. Vidanapathirana, J. Champika, R. Rambukwella and N. Wijesooriya, Quality and safety issues in fruit and vegetable supply chains in Sri Lanka: a review, 2018. Catalogue metadata checked 18 October; full report passage remains unverified.
S4. M. Reitemeier, M. Aheeyar and P. Drechsel, [Perceptions of Food Waste Reduction in Sri Lanka's Commercial Capital, Colombo](https://www.mdpi.com/2071-1050/13/2/838), Sustainability 13(2), 838, 2021. DOI: 10.3390/su13020838. Reviewed 18 October 2026.

## Operational and technical reference points
S5. Sri Lanka Ministry of Health, [Food (Hygiene) Regulations 2011](https://www.eohfs.health.gov.lk/food/images/pdf/regulations/food_hygiene_regulations_2011_en.pdf), Gazette 1742/26. Reopened 24 October 2026. Relevant reference, not an exhaustive statement of all applicable law or an approval for AgriLoop.
S6. Too Good To Go, [Marketplace Store Terms](https://www.toogoodtogo.com/en-us/legal/terms-and-conditions-marketplace), version 3.0, effective 16 June 2025. Sections 1 and 6; jurisdiction-specific. Reopened 24 October 2026.
S7. Vercel, [Hobby Plan](https://vercel.com/docs/plans/hobby). Reopened 24 October 2026. Recheck suitability and pricing when selecting hosting.
S8. OpenStreetMap Foundation, [Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/). Reopened 24 October 2026.
S9. United Nations, [Goal 12](https://sdgs.un.org/goals/goal12) and [Target 12.3 metadata](https://unstats.un.org/sdgs/metadata?Goal=12&Target=12.3). Reviewed 18 October 2026.
S10. United Nations, [Goal 2](https://sdgs.un.org/goals/goal2). Reviewed 18 October 2026.
S11. [FoodLoop](https://www.foodloop.cc/). First-party search description reviewed 18 October 2026 as a local prior-art lead. Features and operational scale were not independently audited.
S12. [Robin Hood Army](https://robinhoodarmy.com/?mob=1). First-party description reviewed 18 October 2026 as a redistribution comparison lead; no independent performance audit.

## Limits of this handover
The guide synthesizes supplied material, the previous review and confirmed owner choices. It does not authenticate historical fieldwork, certify safety or legal compliance, establish live competitor coverage, or guarantee competition outcomes. Examples, suggested designs and calculations must not be relabelled as achieved results. Sources that could not be fully checked remain explicitly qualified.


---

# AI technical appendix - proposed specification

Status: design recommendation, not existing code or an approved final stack. All implementation should remain traceable to the confirmed scope, with policy decisions made explicit.

## A. Decision register

- D01 CONFIRMED: idea stage, no demonstrated implementation.
- D02 CONFIRMED: retail and wholesale both in initial concept and MVP requirements.
- D03 CONFIRMED: sales and food donations.
- D04 CONFIRMED: buyer/recipient collection.
- D05 CONFIRMED: business with free donation channel.
- D06 PROPOSED INTERPRETATION: donation food price and AgriLoop transaction fee both zero; no hidden mandatory platform fee. Real collection/packaging resources remain explicit.
- D07 OPEN: first sites, participants, categories and eligible food protocol.
- D08 OPEN: individual versus organizational donation access and allocation rules.
- D09 OPEN: cash-on-collection versus online payment and supporting settlement process.
- D10 OPEN: revenue instrument, rate, invoicing, refund and fee-reversal policy. Historical 5% is an illustration only.
- D11 OPEN: stack, hosting, notification provider, map service and operating budget.
- D12 OPEN: reservation limits, timeouts, bulk acceptance rules, no-show policy and dispute escalation.
- D13 OPEN: participant-data retention, consent, language rollout and accessibility test criteria.
- D14 OPEN: exact competition deadline/timezone and registered problem-pool definitions.

When asked to implement, distinguish decisions that block a feature from details that can use a clearly labelled reversible prototype default. Do not use live food, real payment collection, partner messaging or public claims as a substitute for resolving required policies.

## B. Functional requirements

- FR01: represent `stream = retail | wholesale` separately from `mode = sale | donation`; support all four combinations.
- FR02: onboard vendors and show approval/suspension status. Proposed first release requires approval before publication.
- FR03: create and revise listings with explicit unit, quantity, price/mode, location, collection window, description and applicable category-policy information.
- FR04: discover available offers by area, stream and mode; provide a usable list without requiring a map or continuous GPS.
- FR05: reserve retail stock atomically; support bulk requests with a clear request/acceptance distinction and atomic reservation on acceptance.
- FR06: present terms and required collection information before confirmation. Snapshot agreed price, unit, listing version and policy version.
- FR07: let a buyer or authorized recipient collector present a pickup reference. QR is a convenience interface over that reference.
- FR08: confirm a single handover with actual quantity. Support partial bulk acceptance, rejection reason and final sale amount where appropriate.
- FR09: cancel, expire, withdraw, reject and dispute transfers without inventing a completed event or improperly restoring unsafe stock.
- FR10: issue separate commercial and donation records. Donation platform fee remains zero under the working interpretation.
- FR11: provide admin review, incident management, suspension and traceable change history.
- FR12: export operational records and metrics with units, periods and status filters. Count completed events, not UI interactions.
- FR13: record commercial fee liabilities and actual collection separately if commissions are selected.
- FR14: keep demo/synthetic data visibly isolated from live operation and reported impact.

## C. Explicit scope boundaries

Required concept: both streams, discounted sale and donation, participant collection, free donation channel, traceability and truthful status.

Not agreed for the first version: delivery fleet, platform-arranged delivery, automatic price prediction, AI food-safety decisions, automatic conversion of sales into donations, cash donations, tax-deduction receipts, nationwide availability, cold-chain ownership, user credit/lending or guaranteed meals. Online payment, subscriptions and specific notification channels are open choices.

Do not simplify the data model into a retail-only bundle marketplace. Conversely, do not overbuild wholesale logistics routing when the agreed fulfilment is recipient collection.

## D. Suggested logical records

Use these as a conceptual model, adapting naming to the selected stack:

1. User: identifier, minimal contact data, consent preferences, account status and timestamps. Do not collect sensitive financial hardship data by default.
2. Organization: vendor/recipient business identity, contact, operating location, verification state and evidence references with restricted access.
3. Membership: user, organization, role and authorization scope. A collector is not automatically a merchant administrator.
4. FoodCategoryPolicy: version, allowed conditions, required fields, review status and effective period. Numeric safety limits require qualified input; do not invent them.
5. Listing: owner, stream, mode, category, food description, lot reference, unit, total quantity, availability, price model, pickup location, pickup interval, eligibility cutoff, policy version and state.
6. Lot: supplier-origin identifier, commodity, declared and measured quantities where available, measurement basis and traceability links. A lot can generate multiple listings/transfers without multiplying its physical supply.
7. BulkRequest: requester, requested quantity, intended collector/organization, requested slot, status and vendor decision. Pending requests should not be presented as guaranteed stock.
8. Reservation: buyer/recipient, listing version, reserved quantity, unit, agreement snapshot, expiry, state and idempotency reference.
9. Transfer: reservation, actual accepted quantity, net weight if measured, rejected quantity/reason, merchant confirmer, collector/recipient confirmation, timestamp and outcome.
10. PaymentRecord: amount, currency, method, status and source of confirmation. Merchant-reported cash is distinct from gateway-verified payment.
11. FeeLedger: fee basis, versioned rate if adopted, amount due, invoice status, collected amount, adjustments and links to completed commercial transfers. Donation fee zero.
12. Incident: affected lot/listing/transfer, category, restricted narrative, severity assessment, responsible operator, actions and resolution. Avoid unnecessary sensitive health details.
13. AuditEvent: actor, action, resource, timestamp, old/new version references and reason. Logs must not expose secrets or contain unlimited copies of personal data.
14. ResearchEvidence: claim identifier, source type, source location, collection date, scope, sample/denominator, permission and verification status. Keep private research exports outside public app data.

Use integer minor currency units or exact decimal arithmetic, never binary floating-point for totals. Use explicit quantity units and appropriate decimal precision or scaled integer weight. Never infer grams from item count without an explicit measurement method. Store timestamps consistently, normally UTC, and render user-facing schedules in Asia/Colombo with explicit local dates.

## E. State machines and invariants

Proposed listing states: draft -> pending review if required -> active -> closed or expired. Suspended/withdrawn states can interrupt availability. Do not publish listings lacking required category-policy fields.

Proposed retail reservation path: reserved -> collected; alternatives cancelled, expired, rejected or vendor-cancelled. Commercial payment status is orthogonal to fulfilment status. A handover record must not falsely imply independently verified cash settlement.

Proposed bulk path: requested -> accepted/reserved -> collected or partially collected; alternatives declined, withdrawn, cancelled, expired or rejected. Use an explicit final settlement step for variable quantities. Pending requests do not consume guaranteed stock unless the selected policy explicitly defines a timed provisional hold.

Donation path shares stock and handover controls but has zero food charge and zero platform transaction fee under D06. It must not require a payment method just to receive a free donation.

Invariant I01: active reservations plus completed transferred quantity cannot exceed eligible offered quantity after legitimate adjustments. All stock mutations must serialize consistently for each listing/lot.
Invariant I02: actual accepted quantity is nonnegative and does not exceed the reserved quantity without an explicit stock reallocation and participant agreement.
Invariant I03: one reservation can create at most one final handover outcome. If partial transfers are supported, define a transaction ledger and an explicit closing rule rather than repeatedly marking the reservation collected.
Invariant I04: expiry and stock checks use server-authoritative time. The user device clock does not establish validity.
Invariant I05: reservation expiry, pickup interval and food-eligibility cutoff are distinct. A reservation cannot extend eligibility.
Invariant I06: a repeated request with the same idempotency key returns the original result, including after a network timeout.
Invariant I07: a merchant cannot read or mutate another merchant's private business records. Recipients see only their own protected transfers and the public listing fields.
Invariant I08: cancellation releases stock exactly once, only if the listing and lot remain eligible and available. Rejected/withdrawn food is not automatically republished.
Invariant I09: material changes to reserved price, quantity basis or description require a documented agreement or cancellation. Preserve the original agreement snapshot.
Invariant I10: a valid QR/reference is necessary only as defined by the chosen flow; it is not sufficient proof of safety, payment, physical quantity or consumption.
Invariant I11: impact aggregates use actual completed quantities and avoid counting supplier dispatch plus recipient receipt as two transfers.
Invariant I12: the selected fee policy applies to completed eligible commercial events only, with explicit reversal rules. Never charge a donation transaction by treating its market value as sale value.

## F. Concurrency and failure behavior

For reservation, lock or conditionally update the relevant inventory record within a database transaction, validate time/state/quantity, create the reservation, and commit once. Notifications are post-commit side effects and should be retryable without creating duplicate reservations.

Bulk acceptance, cancellation, expiry and handover must obey the same stock invariants. Do not let a background expiry worker race with a pickup confirmation and both release and consume the same inventory. Define transaction isolation and unique constraints for the chosen database rather than relying only on button disabling.

If redemption loses its response after commit, retry with the same idempotency reference and show the stored outcome. Do not issue a new reservation or fee to work around a timeout. A duplicate scan should show the original handover status without a second mutation.

The initial proposal does not guarantee final redemption while offline. Cached browsing can be allowed with an explicit stale state. A manual fallback, if approved, must have one responsible operator and reconciliation that preserves single handover; two independent offline scanners cannot ensure global uniqueness by caching the same token.

## G. Privacy and operational controls

Minimize account and location data; keep exact recipient contacts nonpublic; use role-based access; keep service credentials server-side; avoid personal data in QR payloads and logs. Hash or otherwise appropriately protect bearer pickup secrets and give them limited validity. Security details should be evaluated against the selected architecture, not assumed from library names.

Define data retention, complaint access, staff offboarding, backup restoration, suspicious-activity review and communication consent. Record the vendor checks actually performed and avoid describing onboarding as a food-safety guarantee. No AI model may certify food safety from a photo or make automatic health judgments.

## H. Proposed acceptance tests

1. Demonstrate all four stream/mode combinations; donations complete without a food price or platform transaction fee.
2. Race two requests for the last retail unit; exactly one succeeds and available stock never becomes negative.
3. Race bulk acceptances beyond remaining stock; reject or adjust excess through an explicit agreed flow.
4. Retry reserve, cancel and redeem after simulated timeouts; no duplicate reservation, quantity release, transfer or fee occurs.
5. Scan a pickup reference twice; the second attempt produces no second handover.
6. Reject expired, cancelled, withdrawn and wrong-vendor references; a phone clock change does not bypass checks.
7. Cancel/expire while pickup is attempted; verify a single consistent final outcome and quantity balance.
8. Request 30 kg and accept 27 kg; record actual transfer and final price correctly, without automatically relisting rejected stock.
9. Test a donation lot split among recipients; totals never exceed supply and reports do not double-count acknowledgments.
10. Attempt cross-merchant and cross-recipient access; deny protected records server-side.
11. Change price or description after reservation; preserve original agreed terms and require explicit resolution.
12. Simulate notification failure; reservation remains consistent, a retry does not duplicate it, and users can inspect status in-app.
13. Test no-show, vendor withdrawal, complaint and lot-related suspension; affected parties and operator records remain traceable.
14. Verify local-time display across UTC day boundaries and cutoff behavior with server time.
15. Test small screens, keyboard/screen-reader paths, language text expansion and slow connectivity; do not claim accessibility from untranslated mockups.
16. Check calculated metrics against controlled records with cancelled, pending, duplicate and missing-weight cases. Unknown weight remains unknown, not zero.
17. If a commission is selected, distinguish fee due from fee collected, and exercise reversal/refund rules. Donation fee remains zero.
18. Restore a test backup and reconcile records before claiming recovery capability.

These are future test requirements, not tests already executed. Run appropriate tests when implementation exists; do not report them as passed merely because the specification is written.

## I. Evidence and quantitative guardrails

Maintain a claim register with status values such as source_checked, team_reported_unverified, hypothesis, proposed_target, illustrative_example and withdrawn. Include version, exact source locator, period, denominator and uncertainty note. Source-supported national context is not a validated addressable market.

Historical calculations to preserve: 33/42 rounds to 78.6%; 35/42 rounds to 83.3% with stated assumptions. 15 x 160 kg/month x 3 months = 7,200 kg, not meals. 250 x 160 kg/month = 40 MT/month. At a hypothetical 5%, LKR 200 and 250 sales yield LKR 10 and 12.50 gross fees. The old budget sums to LKR 35,000, but is not quoted or approved. These are arithmetic checks, not measured business outcomes.

Do not assume the old exact research dates or roster are true. The current project state overrides historical prototype-completion wording. The 63/100 workbook total is a recorded score with correct arithmetic; its provenance is not independently authenticated and its automatic-calculation instructions are inconsistent with its fixed cells.

## J. Suggested implementation backlog

P0 discovery: resolve blocking food-category, recipient, payment, allocation and support decisions; recover evidence; map four journeys and exceptions. Preserve both streams.

P0 foundation: organizations/roles, category policies, listing/lot model, transaction-safe reservations and bulk acceptance, donation mode, protected records and audit history.

P0 fulfilment: authoritative pickup verification, actual quantities, cancellation/expiry, no-show and incident controls, collector authorization, receipts and correct metrics.

P1 operations: reminders, support tools, exports, data-retention processes, local-language/accessibility checks, budget monitoring and fee accounting if a model is selected.

P2 optional extensions: online payments, more geography/categories, advanced map/search features, automated pricing or logistics features only after evidence and owner approval justify a change of scope.

Implementing shared foundations sequentially is allowed; silently dropping wholesale or donations is not. Do not label one stream operational because the other passed tests.

## K. Agent response and maintenance rules

When asked to continue the project, state the current stage accurately and refer to the confirmed decisions. Inspect any new files and ask only for decisions material to the requested task. Treat new evidence as a reason to update the claim register, not retroactively rewrite research history.

For a coding task, inspect the repository before choosing conventions or creating a new stack. For a document task, preserve distinctions between facts, owner choices and recommendations, include direct citations where claims are made, and do not add unsupported team details. For competition material, check the actual current template and deadline notice; this handbook is not a concept deck.

Keep human and agent documents synchronized. On changes, record date, approving owner, changed requirement, reason and affected tests. Do not quietly promote a proposed fee, technology or safety threshold into a confirmed decision. Do not contact stakeholders, publish claims or incur expenses merely because a proposed workflow mentions them.

## L. Handover completion check

This context is complete enough to explain the idea and design a proposed implementation. It is not complete enough to launch food transfers without the unresolved operational decisions and evidence. The next legitimate progress is a documented design, recovered research, prototype or controlled validation task specifically requested by the owner. Preserve the free donation channel and both-stream vision while doing that work.
