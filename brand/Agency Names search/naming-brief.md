# Naming brief — portable handoff

Everything established so far about naming this business, so a fresh
tool or a fresh conversation can pick up without re-deriving it.
Current status: no name chosen. "Nothing Missed" was recommended on
evidence and rejected by the founder on taste. Do not re-propose it.

---

## 1. The business in one paragraph

A solo studio in the Northern Rivers, NSW, that installs and runs
automatic response and booking systems for small local businesses, so
they stop losing customers who call, DM or ask for a quote when nobody
can answer. Zero clients today. First paying client targeted by
30 Nov 2026. Founder sells face to face, in person, locally.

## 2. Who actually buys — and the words they used

Verified in three field interviews on 30 Aug 2026, not assumed.

**Wayne — solo plumber, Lismore/Ballina**
"It just rings out. I'm not gonna answer covered in shit under someone's
house." · "If I don't get back to 'em quick they've rung the next bloke
on Google." · "Shits me honestly. It's not like I'm ignoring 'em on
purpose." · Loses 6-8 jobs a month at ~$500 each.

**Marco — cafe + catering, Bangalow**
"It goes to voicemail. Nobody checks voicemail anymore, let's be real."
· "It might've been a $2000 event and I'll never know." · "Me actually
sitting down to write the quote. That's the bottleneck, not the phone."
· Jobs are $800-2500. Previously paid a person ~$1,200/month.

**Sarah — solo massage therapist, Byron Bay** (ruled out as ICP)
"I don't want a robot talking to my clients about their back pain."

## 3. The qualification axis

What predicts willingness to pay is NOT the industry. It is whether the
business already pays a human to answer. Wayne and Sarah pay $0 and cap
out around $100/month. Marco paid $1,200/month and said he would pay
"real money, not fifty bucks". The name must work for both ends of that
axis, because both are in the market.

Niches: tradies, hospitality/catering, wellness clinics (not solo
practitioners), real estate, tourism.

---

## 4. Criteria the name must meet

Each of these came from evidence, not preference. Do not relax them
without a reason as good as the one that put them there.

1. **Pronounceable by a tradie on a noisy job site**, over the phone,
   first time, without spelling it.
2. **One spoken word is strongly preferred.** Founder's explicit
   requirement. Two words written together is acceptable if it reads as
   one thing.
3. **Names the RESULT, not the mechanism.** Critical: field data showed
   the pain is at first contact for tradies but at the QUOTE for
   catering. A mechanism name ("Ringback", "Callback") dies the moment
   the pain turns out to be quoting. A result name survives both.
   Marco stretched a result name to cover quoting unprompted.
4. **No "AI", "bot", "automation", "tech", "flow", "synapse" or similar
   as the main word.** The number one objection in the field is "is a
   robot going to talk to my customers?". Putting AI on the shopfront
   pre-loads that objection into every sales conversation. This also
   rules out an .ai domain.
5. **No abstract startup name.** Both strong respondents, asked what
   they'd call such a service, independently reached for plain
   description: "Never Miss a Call or somethin' obvious like that"
   (Wayne) and "something about not losing the booking" (Marco).
   Neither invented an abstract word.
6. **No predatory edge.** A capture verb aimed at the business owner is
   fine; aimed at their customer it is not. A massage client must never
   feel "nabbed".
7. **Works as a social handle** without hyphens or underscores.
8. **Not locked to the region.** "Callback Creek" was rejected for this
   — the founder may need to serve beyond the Northern Rivers.
9. **Survives relocation.** The founder is not yet a permanent resident.
   A .com.au licence requires continuing Australian presence, so a
   portable TLD should be available for the same name as a fallback.

---

## 5. Already tested and rejected — do not re-propose

**Rejected in the field, by real business owners:**
- **Nabbed** — 3 of 3 negative. "Like nabbing crooks?" (plumber),
  "a bit aggressive for wellness" (therapist), "sounds like a parking
  fine app" (cafe owner). The criminal reading surfaced unprompted.
- **Nothing Missed** — 2 of 3 positive with visible reaction, but
  rejected by the founder on taste.

**Rejected on reasoning:**
- Ringback, Second Ring, Callback — mechanism names, die if the pain is
  quoting. Also ringback.com.au and ringback.com are taken.
- Never Miss — crowded trade mark neighbourhood in the exact classes we
  would file in (see section 6). Also an absolute promise the product
  cannot fully keep.
- Callback Creek — locks the brand to the region.
- Pickup — overloaded word, SEO and handle scarcity.
- Aura — 533 trade marks, 209 registered; every domain taken; reads as
  wellness/spiritual, which fits one niche and fights the primary one.
- Vektor, Nexus, Synapse, Flux, Apex, ScaleFlow, Automata, Operant,
  CoreFlow, Cognitive Flow, Kinetix, Prism — abstract startup names.
  They describe the tool we use, not what the customer gets, and every
  sales conversation would start with an explanation instead of a
  question. Rejected after a formal council session with recorded
  dissent.

**Single dictionary words in .com.au are exhausted.** All taken:
offsider, theoffsider, landed, answered, smoko, cobber, keeper, chaser,
standby, sidekick, snagged, sorted, covered, onit, ringer, dinkum.
Descriptive English in .com is exhausted too — 8 of 8 tested were taken.

---

## 6. Verification — how to check, and what was found

**Never assert a domain or handle is available without checking.**
The three methods, in descending order of reliability:

1. **RDAP — authoritative.** For .au:
   `https://rdap.cctld.au/rdap/domain/<name>.com.au`
   For .com: `https://rdap.verisign.com/com/v1/domain/<name>.com`
   HTTP 404 = available. HTTP 200 = registered. HTTP 429 = rate
   limited, means nothing, wait and retry. The auDA endpoint rate
   limits aggressively; leave ~10 seconds between queries.
2. **NS lookup — weaker.** No nameservers suggests unregistered, but
   this produces false positives. `onthetools.com.au` had no NS and was
   registered. Use only as a pre-filter.
3. **Instagram — do not bother.** instagram.com returns HTTP 200 for
   every handle including free ones. That is the login wall, not
   evidence. Handles remain unverified for every candidate.

**Trade marks:** Australian Trade Mark Search, search.ipaustralia.gov.au
— free. Preliminary only; it is not a clearance opinion.

*Corrected 2026-09-11.* This file previously said the search "is
JavaScript-driven, so it needs a real browser, not a URL fetch". That is
true of the entry page and false of the result page. The results are
server-rendered and fetchable directly:

    search.ipaustralia.gov.au/trademarks/search/quick/result?q=NAME

A plain GET returns the full result table (trade mark number, mark text,
classes, status, owner). This drops the cost of a trade mark check from
one browser session per name to one request per name — 64 names were
checked this way. Two limits to carry forward: the table caps at 100
rows, and the search is broad, matching owner names and partial words,
so the word "GASKET" also returns "AA Gaskets Pty Ltd". Filter on an
exact mark string, and treat a mark that merely contains the word,
alive in class 9, 35 or 42, as a serious risk rather than noise.

Findings worth carrying forward:
- "never miss" → 21 marks, 5 registered. NeverMiss (DuluxGroup, class 2)
  and Never Miss Moments (classes 9, 35 and 42 — exactly the software,
  business services and SaaS classes this business would file in).
- "nothing missed", "nevermissed", "nabbed" → 0 results each.
- "aura" → 533 results, 209 registered.

**Currently verified free (.com.au, auDA RDAP):** nothingmissed,
nevermissed, calledback, jobbooked, everylead, nabbed,
sparkiesecretary, ringback.au (the .au direct, not .com.au).

**Constraint on .com.au:** requires an ABN and continuing Australian
presence. The founder does not have permanent residency yet.

---

## 7. Ready-to-paste prompt

Copy from here down into whichever tool you want to use next.

> I need names for a business in the Northern Rivers, NSW, Australia.
> It installs and runs systems that answer enquiries and take bookings
> for small local businesses — tradies, cafes and caterers, wellness
> clinics, real estate, tourism operators — so they stop losing
> customers who call, DM or ask for a quote when nobody can answer.
>
> The buyer is a plumber under a house, a cafe owner in a lunch rush, a
> clinic manager. Not a tech buyer. Sold face to face, locally.
>
> Hard requirements:
> - One spoken word strongly preferred. Must be sayable over the phone,
>   on a noisy job site, without spelling it out.
> - Must name the RESULT the customer gets, not the mechanism. The pain
>   is missed calls for some and slow quoting for others, so a name tied
>   to phone calls specifically will not survive.
> - No "AI", "bot", "automation", "tech", "flow", "synapse", or any
>   abstract startup-sounding coinage. Customers ask "is a robot going
>   to talk to my customers?" and the name must not invite that.
> - Australian English and Australian idiom welcome, but not so
>   regional that it locks the brand to one town.
> - No capture or hunting verb aimed at the end customer — nobody
>   should feel caught.
> - Must work as a social handle with no hyphens or underscores.
>
> Already rejected, do not suggest these or close variants: Nabbed,
> Nothing Missed, Never Miss, Ringback, Second Ring, Callback,
> Callback Creek, Pickup, Aura, Vektor, Nexus, Synapse, Flux, Apex,
> CoreFlow, Kinetix, Prism, Automata, Operant, ScaleFlow.
>
> Also note: single English dictionary words are already taken in
> .com.au — offsider, landed, answered, smoko, cobber, keeper, chaser,
> standby, sidekick, snagged, sorted, covered, ringer and dinkum are
> all registered. So either propose coined words, or compounds that
> read as one word.
>
> Give me 8 candidates. For each: the name, one line on why it names
> the result, one line on the biggest risk with it, and the .com.au
> and .com to check. Do not claim any domain is available — I will
> verify myself.

---

## 8. What to do with the candidates

1. Verify each by RDAP before getting attached — method in section 6.
2. Search each at search.ipaustralia.gov.au, and search the neighbours
   too, not just the exact string.
3. Then say the survivors out loud to three actual business owners and
   watch their faces before they speak. That is what killed "Nabbed",
   and no amount of analysis substituted for it.
