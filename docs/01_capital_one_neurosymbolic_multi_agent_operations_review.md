# Capital One — Neurosymbolic Multi-Agent Operations Review System

## 3 KPIs / Key Results

- **Review time:** ~20 minutes → ~2 minutes
- **Workflow scale:** Built for ~1M monthly fraud / operations reviews
- **Use cases:** Expanded to 4 rails/ use cases
- **Program impact:** Created a new GenAI program pillar and reusable automation pattern

## What it does

A neurosymbolic multi-agent review system for high-volume operational workflows. The system pulls evidence from multiple systems into a structured review bundle, uses AI to interpret and summarize the evidence, and then applies deterministic decisioning and evaluation gates where consistency, governance, and auditability matter most.

The goal was to compress the repetitive parts of review work while keeping policy-sensitive judgment, escalation, and control points explicit.

## My role

I defined the product and technical requirements, built the POC, led the research, recruited PM and engineering support, designed the architecture and evaluation harness, and aligned stakeholders around the path from manual review to safe automation.

A lot of the PM work was deciding what the agent should not do. In a regulated environment, the system boundary was as important as the system capability.

## Outcome

The system reduced review time from about 20 minutes to about 2 minutes and created a reusable pattern for governed agentic automation in a regulated bank environment. The stronger signal is not just the time savings. It is the product shape: evidence assembly, AI interpretation, deterministic controls, and human review all separated into clear layers.

## Write-up

### Summary

At Capital One, I led the 0-to-1 build of a neurosymbolic multi-agent system for high-volume fraud and operations reviews. The system was designed to reduce the amount of time reviewers spent gathering and interpreting evidence, while keeping the parts of the workflow that required consistency, policy adherence, and auditability under deterministic control.

The practical result was a review workflow that moved from roughly 20 minutes to roughly 2 minutes per case. The broader product result was a new pattern for using agentic AI in a regulated operating environment.

### Problem

All model detected fraud relied on a manual review process requiring that OpEx scaled linearly with customer growth. Additionally there is quality variance  that comes along with manual review processes. Even the best reviewers still had quite the task to complete within SLAs.

A reviewer had to pull evidence from multiple systems, normalize what they were seeing, interpret the case, and then make a decision using a wide range of policy and governance constraints. The core issue was not that humans were bad at the work. It was that too much of their time was spent on repetitive evidence assembly and synthesis before they could apply judgment.

At the scale we were working toward, small workflow inefficiencies became meaningful operational issues. The product question was: where can AI safely compress the workflow, and where should deterministic logic or human review remain in control?

### Approach

I framed the system as neurosymbolic.

That distinction mattered. The workflow had parts where a model could help a lot: summarizing case evidence, extracting relevant signals, identifying missing information, and giving reviewers a structured readout. But there were also parts where we needed repeatability: policy rules, decision thresholds, escalation criteria, and evaluation gates.

The architecture had three main layers.

**Evidence assembly layer**

This layer pulled the relevant case data into a structured review bundle. The goal was to reduce context-switching and make sure the same categories of evidence were collected consistently.

**AI interpretation layer**

This layer helped summarize and interpret the evidence. It was useful for turning a scattered set of signals into something a reviewer or downstream system could reason over.

**Deterministic decisioning and evaluation gates**

This was the control layer. For the parts of the workflow where consistency, governance, or auditability mattered, we used deterministic logic and eval gates rather than relying on open-ended model judgment.

The design principle was simple: use the model where ambiguity and language understanding are useful; use deterministic checks where consistency matters more than flexibility.

### Evaluation

The evaluation harness focused on whether the system improved the workflow without creating unacceptable decision risk.

The main things I cared about were review-time reduction, evidence completeness, compliance and policy adherence, escalation quality, and auditability. I wanted to know whether the system could reliably produce a useful case review object, whether it knew when not to automate, and whether a reviewer could trace why a recommendation or summary was produced.

The system was intentionally designed so the model was not the only line of defense. Deterministic gates, traceability and human-review paths were part of the product architecture.

### Tradeoffs

The biggest tradeoff was speed versus control. It would have been faster to build a looser AI assistant that summarized cases and left the rest to users. That would have been easier to demo, but weaker as a product. The more useful product was a workflow system where the AI helped with interpretation, but policy-sensitive actions were constrained.

Another tradeoff was product simplicity versus operational realism. A pristine product would have hidden edge cases. A real system needed to surface missing evidence, ambiguous cases with confidence thresholds, and escalation paths.

### Outcome

The system cut review time from about 20 minutes to about 2 minutes. More importantly, it created a reusable pattern for governed agentic automation inside a regulated bank environment.

### What I learned

The biggest lesson was that agentic systems need boundaries.

The model can help compress the messy middle of a workflow, especially when the work involves summarizing or interpreting a lot of context. But our jobs as PMs is to decide where flexibility is valuable and where flexibility becomes risk.


