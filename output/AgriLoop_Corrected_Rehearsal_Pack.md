# AgriLoop — corrected rehearsal pack

Updated 27 October 2026. Idea-stage project; proposed activities and costs are not completed results.

Companion deck: TeamFade_ConceptDeck_Budget_Final.pptx.

## Spoken pitch

### Slide 1: Cover

Estimated speech: 27 whitespace-separated words; 0 min 12 sec at 130 words/minute. Do not read this timing label aloud.

Good morning. We are Team Fade from General Sir John Kotelawala Defence University. AgriLoop is our idea-stage surplus food platform concept, addressing SDG 12 and SDG 2.

### Slide 2: Team and mentors

Estimated speech: 41 whitespace-separated words; 0 min 19 sec at 130 words/minute. Do not read this timing label aloud.

We are three second-year Software Engineering students. Mohanaram Uvaram leads backend development and testing, Manidu Samaranayake covers interface usability, and Yasith Peiris handles coordination and interviews. We have no confirmed mentor yet and seek food-safety advice before any future live-food trial.

### Slide 3: Problem

Estimated speech: 104 whitespace-separated words; 0 min 48 sec at 130 words/minute. Do not read this timing label aloud.

Our starting point is unsold retail food and surplus wholesale produce. The 2024–25 BRIGHT survey reports that 32.8% of Sri Lankan households, and 35.3% of urban households, experienced moderate or severe food insecurity over the preceding twelve months. A 2021 Colombo paper cites earlier research attributing about 42% of the city's food waste to restaurants, markets and meat shops.

These figures establish context. They do not tell us how much food is safe and available for redistribution. Our hypothesis is that short collection windows and coordination effort prevent some eligible surplus from reaching buyers or recipients. We need direct observations to test that hypothesis.

### Slide 4: Users and evidence

Estimated speech: 72 whitespace-separated words; 0 min 33 sec at 130 words/minute. Do not read this timing label aloud.

Our intended users are vendors, nearby buyers collecting retail bundles, and bulk buyers or community organisations arranging their own collection of wholesale produce.

We plan outreach in Wellawatte, Ratmalana and Panadura, but have no recruited vendors yet. An earlier submission reported a 42-person survey. We do not have the original responses or interview notes, so those findings remain preliminary and unverified. Demand, willingness to participate and affordable collection distances still need testing.

### Slide 5: Solution

Estimated speech: 85 whitespace-separated words; 0 min 39 sec at 130 words/minute. Do not read this timing label aloud.

AgriLoop would combine retail surplus and wholesale produce in one web platform. It would support discounted sales and free donations. Donations would have both zero food price and zero platform fee.

Buyers and recipients would collect items themselves within vendor-set pickup windows. We do not plan a delivery fleet. Our intended model is a business with a free donation channel; the commercial fee structure remains to be validated.

The proposed flow is listing, reservation or request, collection, and recorded handover. Nothing has been built yet.

### Slide 6: How it works

Estimated speech: 92 whitespace-separated words; 0 min 42 sec at 130 words/minute. Do not read this timing label aloud.

Vendors would enter the food category, quantity, units, sale price or donation status, and collection window. The backend would check permissions and stock.

We plan atomic stock updates for retail reservations, meaning availability is checked and changed together. Wholesale requests would require vendor acceptance, with stock checked again when accepted. Users would receive a reservation reference and collection terms. The vendor would record completed handover.

Our proposed stack uses Supabase and PostgreSQL, with Render hosting in the funded scenario. We still need to implement and test reservations, cancellations, expiry and simultaneous requests.

### Slide 7: Innovation and prior art

Estimated speech: 78 whitespace-separated words; 0 min 36 sec at 130 words/minute. Do not read this timing label aloud.

We describe AgriLoop as an adaptation of existing approaches. Too Good To Go offers store collection through Surprise Bags and also delivered surplus parcels. The Robin Hood Army uses volunteer-led, zero-funds redistribution and lists Sri Lanka in its network.

Our proposed combination brings discounted sales and free donations across retail and wholesale produce into a self-collection workflow. We do not claim that these features are individually unique, or that our combination is already effective. Local suitability needs evidence.

### Slide 8: Impact and SDGs

Estimated speech: 87 whitespace-separated words; 0 min 40 sec at 130 words/minute. Do not read this timing label aloud.

Our primary alignment is SDG 12.3 on food waste, with a secondary contribution intended toward SDG 2.1 on food access.

A later live pilot could measure quantities collected, completed collections and buyer savings after travel. We have no measured baselines yet; live targets will follow baseline research.

The immediate prototype will test usability and stock logic using simulated transactions. We will record whether users complete tasks independently, need help or fail, and test whether concurrent reservations exceed available stock. These results will not establish real food-waste reduction.

### Slide 9: Feasibility

Estimated speech: 78 whitespace-separated words; 0 min 36 sec at 130 words/minute. Do not read this timing label aloud.

Our proposed cash budget is LKR 60,000 for a student-built prototype and two months of hosting. Student labour and existing devices are contributed separately; this is not a commercial app development quotation.

The team has committed LKR 5,000, leaving LKR 55,000 unsecured. Without additional funding, our target is a local demonstration on existing devices.

This phase uses simulated food transactions. Before any live-food trial, we will confirm applicable requirements, obtain appropriate food-safety advice and establish suitable operating procedures.

### Slide 10: Prototype plan and budget

Estimated speech: 89 whitespace-separated words; 0 min 41 sec at 130 words/minute. Do not read this timing label aloud.

Week 1 starts recruitment, interviews and surplus logging. Five trading days of logging begin once access is secured and may continue alongside development. Week 2 targets accounts and listings; Week 3 adds reservation, donation, bulk-request and handover flows. Week 4 targets testing with recruited users and simulated data.

The cash estimate allocates LKR 22,400 to hosting, 17,500 to database services, 5,000 to a domain allowance, 4,000 to travel, data and printing, and 11,100 to contingency.

Live food operations, payments, delivery and native mobile apps are outside this prototype scope.

### Slide 11: Risks and ethics

Estimated speech: 76 whitespace-separated words; 0 min 35 sec at 130 words/minute. Do not read this timing label aloud.

We plan to address overbooking through atomic stock updates and tests of simultaneous requests, cancellations and expiry. If recruitment is delayed, technical demonstrations can continue, but user validation will remain incomplete. If funding is unavailable, we will develop locally.

Food-safety risk in a future live pilot remains unassessed; this prototype uses simulated transactions only.

Our key operational assumption is that vendors can list eligible surplus in time and recipients can collect it at a worthwhile cost.

### Slide 12: Closing and ask

Estimated speech: 49 whitespace-separated words; 0 min 23 sec at 130 words/minute. Do not read this timing label aloud.

AgriLoop aims to connect eligible surplus with buyers and donation recipients through scheduled self-collection.

We seek LKR 55,000 toward the proposed hosted prototype, introductions to retail and wholesale vendors for research, and food-safety mentorship. Our next step is to test the assumptions and build the core workflow. Thank you.

## Jury questions and answers

### Why budget LKR 60,000 for an early prototype?

It is one proposed paid deployment scenario, not a minimum requirement. Our estimate uses two months of Render workspace and web-service costs, plus Supabase database services, alongside a domain allowance, research expenses and contingency. The planning assumptions are USD 32 per month for Render and USD 25 per month for Supabase, converted at LKR 350 per USD. These are budget assumptions carried from the deck, not supplier quotations or a guaranteed bill. We will recheck prices, taxes, plan limits and exchange rates before purchase. Student labour and devices are in-kind. A local prototype remains our fallback.

### What happens after the two funded months?

The assumed base cloud cost would be about LKR 19,950 per month at that planning exchange rate, before extras, taxes, domain renewal and labour. Continued hosting needs a separate funding decision. We have not secured ongoing funding or validated revenue.

### What can you deliver with only LKR 5,000?

Our target is a functional local web prototype on existing devices, with accounts, listings, simulated reservations and handover records. Delivery depends on development time and technical results. We would retain LKR 4,000 for travel, data/calls and printing, and LKR 1,000 as contingency within the team's cap. Local demonstrations avoid paid cloud hosting, but still require working devices, setup and participant access. No live food transfers are included.

### How will you recruit vendors without contacts?

We will try direct outreach in Wellawatte, Ratmalana and Panadura and seek introductions through university networks. We need actual wholesale suppliers as well as retail vendors; a retail fruit stall does not automatically qualify as wholesale. Other wholesale hubs are possible leads, not agreed destinations. Our proposed small research sample is two retail vendors, one wholesale vendor, four buyers and one bulk buyer or organisation representative. None is recruited yet, and this sample cannot establish market-wide demand.

We will request permission to record surplus over five trading days, which need not be consecutive. Recruitment may extend beyond Week 1. If wholesale access is unavailable, we can demonstrate that workflow with simulated data, while reporting that wholesale user validation remains incomplete.

### What would make you change the idea?

We would reconsider a selected category, location or workflow if eligible surplus is insufficient, collection costs exceed the benefit, or listing requires too much vendor effort. We will record existing destinations such as staff consumption, discounting, donation or animal feed, rather than assume all unsold stock is available or wasted. If safe handling is impractical for one category, that finding applies first to that category. We would gather further evidence before deciding whether the wider concept should stop.

### How does AgriLoop earn money if donations are free?

The intended business model earns from the commercial side while keeping donated food and donation platform fees at zero. We have not selected or validated a commission or subscription price. Vendor willingness to pay, transaction values and operating costs must inform that decision. The current prototype does not process payments, and we have no revenue evidence.

### Does an advisor approve the live pilot?

We are seeking expert advice, not claiming that one advisor's approval replaces applicable requirements. Before any live-food trial, we will confirm those requirements and establish suitable procedures. There is no live-food trial in this prototype scope.

## Rehearsal and remaining confirmations

- Treat all durations below as estimates, not measured rehearsal results. Numbers and abbreviations can take longer to speak than a whitespace word count suggests.
- Until the organiser confirms otherwise, rehearse with the cover and team introduction inside the eight-minute limit.
- Run two complete timed takes with slide changes and pauses. Shorten wording where needed rather than rushing the figures.
- Confirm the submission number, actual submission date, filename requirements and timing rules with the organiser before submission.
- Use slides 13 and 14 for supporting evidence during questions rather than reading them as part of the pitch.
- This pack revises the spoken script and Q&A. The PowerPoint has not been edited by this operation. Its Week 1 schedule should be presented as starting recruitment and logging, not guaranteeing completion of five trading days in that week.

## Calculated timing

- All slides 1–12: **878 words; 6 min 45 sec** before pauses.
- Core slides 3–12: **810 words; 6 min 14 sec** before pauses.
- Cover and team: **68 words; 0 min 31 sec** before pauses.
- If all twelve slides count toward eight minutes, the estimated remaining pause and transition allowance is **75 seconds** at 130 words/minute.

No actual rehearsal duration has been measured.
