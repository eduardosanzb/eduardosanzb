## Meeting Notes - Head of Engineering(Davin): Incident Management

### I. Warm-Up & Relationship Building (5-10 mins)

- **Recap Current Work:** Briefly mention positive progress on [project name]. _"Things are progressing well with X, which got me thinking about broader workflows…"_
- **Priorities Check:** "What are the biggest priorities for engineering right now?" **(Trigger: _Scale_, _Stability_, _Speed_, _Cost Reduction_, _Developer Happiness_)** - Listen carefully! This dictates your pitch.
- **Initial Probe (Gentle):** “How does the team typically handle unexpected issues/outages?” **(Trigger: _Ad-hoc_, _Tribal Knowledge_, _Reactive_)**

### II. Understanding Current State – Discovery Phase (15-20 mins)

- **Walkthrough Scenario:** "Could you walk me through a typical production issue, from detection to resolution?" **(Trigger: _Missing Steps_, _Manual Processes_, _Lack of Documentation_)**
  - Follow up: “Who’s involved at each stage?”
- **Prioritization Criteria:** "How do you prioritize incidents? What determines severity?" **(Trigger: _Inconsistent_, _Subjective_, _No Clear Escalation Path_)**
- **Communication Flow:** "How do you communicate during an incident – internally & externally?" **(Trigger: _Slack Chaos_, _Email Chains_, _Delayed Notifications_, _Customer Impact_)**
- **Metrics Tracking:** “Do you track any metrics related to incidents (MTTD, MTTR, frequency)?” **(Trigger: _No Metrics_, _Gut Feeling_, _Limited Visibility_)**
- **Monitoring/Alerting Tools:** "What tools do you use for monitoring and alerting?" **(Trigger: _Tool Sprawl_, _Integration Issues_, _False Positives_)**
- **Post-Incident Review:** “After resolution, what steps are taken to prevent recurrence? Do you conduct RCAs?” **(Trigger: _No Postmortems_, _Blame Culture_, _Repeated Incidents_)**

### III. Ideal State – Introducing Incident Management Concepts (20-30 mins)

- **Transition:** "Sounds like there's an opportunity to streamline things & reduce those challenges."
- **Incident Mgmt as Discipline:** “It’s not just software; it’s clear processes, roles, minimizing impact, and learning.”
- **Key Concepts (Briefly):**
  - **Lifecycle:** Detection -> Triage -> Investigation -> Resolution -> Post-Incident Review. _(Visual diagram helpful)_
  - **Severity Levels:** Clear P1/P2 criteria.
  - **On-Call Rotation:** Structured schedules, smooth handoffs. **(Trigger: _Burnout_, _Always On_)**
  - **RCA:** 5 Whys technique. Prevent recurrence.
  - **Postmortems:** Blameless learning.
- **Benefits (Tailor to their priorities):**
  - **Faster Resolution:** Reduce MTTR.
  - **Reduced Downtime/Impact:** Improved customer satisfaction.
  - **Engineering Efficiency:** More time building, less firefighting. **(Trigger: _Context Switching_, _Firefighting_)**
  - **Team Morale:** Reduced stress.
  - **Visibility & Reporting:** Data-driven improvements.
- **Software as Enabler (AFTER process):** "Tools like [PagerDuty, Opsgenie, FireHydrant] can automate these processes." _(Don't push a specific tool yet)_

### IV. Next Steps & Call to Action (10-15 mins)

- **Opportunity Statement:** “I think there’s real potential to improve your incident management process.”
- **Scoping Session Proposal:** "Let's schedule a session to dive deeper into your needs and create a tailored plan." _(Process mapping, tool evaluation, KPI definition)_
- **Offer Value:** "I can put together a quick assessment of your current state based on our conversation today."
- **Budget/Timeline (Be prepared):** “Implementation typically involves [rough estimate]. We can discuss budget in detail during scoping.”
- **Confirm Commitment:** “Does that sound like something you’d be interested in exploring?” **(Trigger: _Yes_, _Maybe_, _Concerns_)**

---

**Key Trigger Words to Listen For:**

- **Reactive:** Indicates a lack of proactive planning.
- **Manual:** Suggests inefficient processes ripe for automation.
- **Tribal Knowledge:** Highlights reliance on individuals and risk of knowledge loss.
- **Chaos/Ad-hoc:** Points to communication breakdowns.
- **Burnout/Always On:** Signals issues with on-call management.
- **Firefighting/Context Switching:** Indicates wasted engineering time.

Remember to actively listen, paraphrase their responses, and tailor your approach based on their specific needs!
