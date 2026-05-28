# Project Atlas — Agentic Fraud Eval & Safeguards Lab

## 3 KPIs / Key Results

- **Eval loop:** 3 red-team / defense / deterministic-judge rounds
- **Reviewer flow:** 5 public-safe demo steps
- **Implementation status:** Phases 1–10 materially present in the local demo path

## What it does

This is an Adversarial Testing Lab for Agentic Safeguards (ATLAS) -- one of the best project names chagpt has come up with for me by the way. Shout out to GPT 5.5. Red-team simulation agents search for weaknesses in a mock account-takeover risk scorer. Bank-defense simulation agents propose fixes. A deterministic judge (as opposed to LLM as judge) decides whether each fix actually improves recall at fixed action-rate limits without creating too much customer friction.

Of course, the project is synthetic and not a production fraud model and does not use real bank, customer, account, or feature data. All features are available through a simple google search.

## My role

I designed and built evertything here: the product concept, synthetic data loop, red-team / defense / judge roles, deterministic evaluation structure, safety posture, and web storytelling layer. 

The idea was inspired by and the design leans heavily on Anthropic's Project Deal. 

There's a separation of responsibilities: agents search and propose, but deterministic code decides what is additive.

## Outcome

The outcome is a working public-safe lab for an agentic red-team / defense loop. The focus is exploring structuring an eval environment in an adversarial context.

## Write-up

### Summary

Project Atlas is a synthetic red/blue evaluation lab for agentic fraud safeguards. Red-team simulation agents search for weaknesses in a mock account-takeover risk scorer. Bank-defense simulation agents propose fixes. A deterministic judge decides whether the fix actually improves recall at a fixed action-rate limit without creating too much customer friction.

The point of the project was to build the red-team / defense / judge loop concrete enough to illustrate the concept of defending against scaled fraud attacks. 

### Problem

A lot of agent demos are persuasive but hard to trust.

That is especially true in regulated financial workflows. If a red-team agent finds a weakness, you still need to know whether that weakness is real, whether the proposed fix generalizes, and whether the fix creates too much friction for legitimate customers.

I wanted to explore whether agents help search the problem space while deterministic evaluation decides what counts as an improvement?

That separation felt important. In a high-stakes workflow, I would not want an agent to discover the issue, propose the fix, and grade its own homework.

### Approach

I built Atlas as a closed-loop synthetic arena.

The system starts with synthetic customers, events, graph data, features, labels, and a mock account-takeover scorer. A red-team agent looks for under-ranked synthetic cohorts. A defense agent proposes a fix. Then a deterministic judge evaluates the fix across clean, adaptive, locked, and drifted holdouts.

The product boundary was as important as the product itself. The public demo uses off the shelf labels from google searches, weak synthetic identifiers, and demo-constant thresholds.

The evaluation focuses on trends like model miss rate, recall at a fixed action rate, synthetic loss allowed, and customer-friction rates.

### My role

I designed everything here: the product concept, the safety posture, the evaluation loop, and the demo flow, and built it of course.

That included defining the red-team / defense / judge roles, deciding where agents were allowed to propose and where deterministic code had to decide, shaping the public-safe language, and building a reviewer experience that made the system inspectable without making operational fraud claims.

I also thought through the portfolio problem: how to show agentic safety work in a way that feels real, but does not imply access to real fraud systems.

### Evaluation

The deterministic judge evaluates whether a defensive fix improves recall while respecting action-rate and customer-friction constraints.

The demo also includes locked holdouts, public-mode safety scanning, and a reviewer path that runs locally without external LLM calls.

### Tradeoffs

The biggest tradeoff was agent freedom versus evaluator discipline. The agents needed enough freedom to generate interesting proposals, but the judge needed to be boring and repeatable. Here, boring is a feature.

### Outcome

The outcome is a demonstration of the boundaries around an agent system: synthetic data, fixed thresholds, deterministic judging, locked holdouts, and explicit non-goals.

And if I havent made this abundantly clear yet, this is not a production fraud engine. I am showing how I would think about an evaluation environment before trusting anything like this near production.

### What I learned

The agent can be creative. The judge should be boring. A good eval system should make it hard for a model to win by sounding convincing.

If I extended this, I would spend more time on repeat-run variance, richer failure taxonomies, and side-by-side comparisons of different red-team strategies under the same deterministic judge.
