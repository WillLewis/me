# Regulated Agent Launch Kit — AI Launch Readiness for Regulated Workflows

## 3 KPIs / Key Results

- **Full dataset:** Improved profile passed 10/10 cases vs. baseline 7/10
- **Runtime evaluator:** 10/10 catch-rate
- **Adversarial slice:** Improved profile passed 6/6 cases vs. baseline 3/6

## What it does

A regulated-agent deployment-readiness kit that turns workflow maps, traces, evals, regressions, approval gates, and redacted evidence packs into launch/no-launch recommendations.

It uses a synthetic embedded-finance workflow and a deterministic LangGraph proof loop to show how regulated AI products can be evaluated more efficiently (think asynchronous cross-functional approvals, etc) before launch.

## My role

I defined the workflow architecture, launch-readiness artifacts, synthetic policy and case model, evaluator-vs-grader separation, approval boundaries, regression seeds, and evidence-pack flow.

The product point was that launch readiness is not a slide at the end. It is a product surface that shapes the system itself.

## Outcome

The current launch posture is explicitly “not ready for pilot,” which is the right posture for the evidence available. The project shows what a responsible readiness loop would look like: traces, deterministic evals, approval boundaries, regression cases, redacted evidence, and honest launch criteria.

## Write-up

### Summary

Regulated Agent Launch Kit is a synthetic embedded-finance deployment-readiness case study. It is structured around the full launch loop: workflow mapping, measurable multi-agent behavior, traces, deterministic-first evals, redacted evidence, regressions, and a launch/no-launch recommendation.

The core idea is that regulated AI products need more than a model score. They need evidence. They need approval boundaries. They need a clear launch posture. And I dont know of a tool that streamlines this for AI/ML PMs as of publishing this. If you do please reach out to me :)

### Problem

Most agent demos skip the hard parts of regulated deployment.

They show an agent doing a task, but they do not show the workflow map, the risk register, the acceptance criteria, the approval matrix, the regression seeds, or the evidence pack a review team would need.

I wanted to build the version that asks: what would I need to show before I could responsibly recommend a pilot? Development has accelerated exponentially over the past year. Approval flows are becoming even bigger bottlenecks, relatively speaking. What if we can accelerate cross-functional decision-making using some of the same tools we've used to accelerate builds?

The artifact here is less the agent, and more the launch-readiness system around the agent.

IYKYK. Enterprise AI/ML PMs if you're with me, let's chat.

### Approach

The architecture follows a synthetic Financial Links reliability workflow.

A synthetic case flows through an intake normalizer, an orchestrator agent, a specialist agent, synthetic tools and policies, an evaluator node, a human approval node when required, a final response composer, trace and eval artifacts, redacted evidence, and finally an eval card / pilot recommendation.

The public proof loop is deterministic and local. It uses a real LangGraph StateGraph, but every node is deterministic and no LLM is called in the default path. An optional LLM candidate can draft customer-facing text, but deterministic logic still owns tool calls, policy citations, approval boundary, and prohibited-action avoidance.

That distinction matters. In a regulated workflow, I would not want an LLM to be the source of truth for whether approval is required or whether a policy boundary applies.

### My role

I designed the launch-readiness structure: workflow map, value case, KPI tree, acceptance criteria, risk register, dependency map, eval artifacts, regression seeds, and redacted evidence flow.

I also designed the evaluator / grader separation. The runtime evaluator checks the agent output before the final response is composed. Offline graders run after a trace completes and score concepts like handoff completeness, required tool use, consent boundary, approval boundary, and schema validity.

That separation is one of the most important product choices in the project. Runtime guardrails and offline audit graders have different jobs. Keeping them separate makes the evaluation more honest.

### Evaluation

The main evaluation pattern is baseline versus improved profile. So lift essentially.

On the full dataset, the intentionally weak baseline passed 7 out of 10 cases, while the improved profile passed 10 out of 10. The runtime evaluator catch-rate was 10 out of 10 in both profiles, and the baseline failures were labeled as policy miss, tool misuse, and unsafe customer communications.

The project also includes a six-case adversarial slice designed around social pressure, overpromise, policy elision, and hallucination prompts. On that slice, the baseline passed 3 out of 6 cases and the improved deterministic profile passed 6 out of 6.

Then there is what I'm calling approval-grading asymmetry. The runtime evaluator can only see what the agent declared. The offline approval-boundary grader uses the case’s ground-truth risk band and consent sensitivity. As a result, an orchestrator misroute can't lower the declared risk threshold and still get through approval grading.

As you can tell, the system was designed for realistic failure modes.

### Tradeoffs

The biggest tradeoff was demo completeness versus launch honesty. It would have been easy to position the project as a “ready-to-launch agent.” We're not doing that. The project shows that the local synthetic loop closes, but I do not claim production behavior, model quality, partner endorsement, or regulatory compliance.

Another tradeoff was deterministic proof loop versus live-model realism. For readiness artifacts, determinism made the evidence easier to inspect. Live-model behavior is useful, but it belongs behind opt-in, phase-gated runs with redacted evidence. So the deterministic approach probably does the trick here.

### Outcome

This project is NOT ready for pilot. The local synthetic vertical slice proves that the deployment-readiness loop closes locally with deterministic artifacts, but it does not prove production behavior, model quality, partner endorsement, or regulatory compliance.

### What I learned

I'm exploring launch readiness as a first-class product surface.

The workflow map, risk register, acceptance criteria, eval cards, redacted traces, and launch posture all shape the system itself.

Next steps: focus on repeat-run variance for LLM candidates, more realistic reviewer workflows, and a clearer comparison between runtime guardrail misses and offline audit findings.
