# Voice Agent Prompt Lab — Insurance FNOL Voice Agent Evaluation Harness

## 3 KPIs / Key Results

- **Scenario suite:** 6 insurance voice-agent scenarios, including a lapsed-policy edge case
- **Evaluator:** 12 rule-based checks × 6 scenarios = 72 deterministic assertions, plus an optional LLM judge
- **Demo reliability:** Live model mode with per-turn fallback tagging; deterministic baseline always available, no API key required

## What it does

A local-first prompt and evaluation lab for an insurance voice agent across first notice of loss, policy servicing, escalation, and adversarial scenarios. Pick a scenario, run it, and inspect the transcript, tool calls, system prompt, and pass/fail/warn scorecard. Edit a guardrail directly in the UI, re-run the scenario, and watch the score change.

The lab isolates the reasoning layer behind a voice agent: prompt, state machine, tool contracts, guardrails, escalation policy, and evals — with a closed loop between what the prompt says and whether the evaluator catches a regression.

## My role

I defined the voice-agent scenarios, tool contracts, conversation-state requirements, escalation rules, adversarial tests, and regression-eval approach.

The product goal was to make the hidden requirements visible — and then make them breakable on purpose.

## Outcome

A compact demo that shows how I think about voice-agent reliability. It does not claim to be production telephony. It shows how I would decompose the problem before production: scenarios, state, tools, escalation, adversarial tests, deterministic evals, and regression gates. With the live model running, it also shows exactly what happens when you change the prompt.

---

### Summary
First I have to start with "Why insurance voice agents?" Well, voice agents are easy to demo. They are hard to make reliable. And in insurance — where the wrong word about coverage can create a legal exposure and there is often an adversarial relationship — that gap is a product-design problem. 

How do you ensure voice chat agents, especially those in inherently tense situations, work ahead of exposing them to customers?

Voice Agent Prompt Lab is a prompt and evaluation lab that makes the reliability layer visible. A reviewer can pick one of six scenarios, run it, and inspect the transcript, tool calls, system prompt, and pass/fail scorecard. Or they can edit the system prompt directly and see whether a guardrail actually holds on the next run.

### Problem
A good-sounding conversation is not enough. The agent has to verify identity before looking up a policy, collect required fields before creating a claim, avoid making coverage guarantees, escalate injury cases quickly, resist prompt-injection attempts, and refuse to act on a lapsed policy. Those are workflow and safety requirements — not tone requirements.

The product question was: can I make those hidden requirements visible? And then: can I make it easy to break them on purpose so a prompt change does not silently regress them?

### Approach
I structured the app around six scenarios. The first five cover the core failure modes — routine FNOL, injury escalation, policy servicing, a coverage-guarantee trap, and a prompt-injection attempt. The sixth adds a lapsed-policy case: the caller wants to file a claim, the policy expired three months ago, and the agent must refuse to open one and escalate to a human for reinstatement options.

The system runs in two modes. Deterministic mode produces reproducible transcripts with no network dependency — the demo works without an API key and is useful for walking through the workflow. LLM mode runs the current system prompt through a live model and scores its actual behavior. Both modes share the same scenarios, mock tools, state machine, and evaluator.

Several additions make LLM mode useful beyond a chat window. An adaptive caller can play five personas — cooperative, rushed, confused, irate, or evasive-adversarial — each backed by a private fact-sheet that serves as the single source of truth for the caller's name, ZIP, and loss context. ASR noise simulation garbles ZIP codes, years, and VIN-like sequences in caller utterances to test whether the agent confirms critical details before submitting anything. And every agent turn carries a source tag — "llm" or "fallback" — so a silent schema error can never pass as a live model run. The transcript banner shows exactly which turns the model produced and which the fallback script filled in.

The UI closes the loop: the System Prompt tab is a live textarea; a Versions tab saves named snapshots to localStorage with per-scenario score history and a line-level diff between any version and the current state.

### My role
I defined the scenarios, tool contracts, state-machine expectations, escalation behavior, and the evaluator.

The main product work was deciding what counts as a failure — and keeping failures visible. The mock tools do not block bad calls. lookupPolicy runs without prior identity verification. createClaim runs with missing fields. That is deliberate: the evaluator catches the violation; the tool does not hide it. Failure modes are observable instead of masked by a protective backend.

I also separated the behavioral prompt from the structural output contract. The harness injects the JSON schema and tool argument shapes on every request, independently of whatever is in the editable system prompt. A one-sentence prompt still produces a scoreable run. That mirrors how production agent frameworks work — and it means prompt iteration cannot silently break the runner.

### Evaluation
The evaluator runs 12 rule-based checks over the transcript and tool trace: identity-before-lookup, required-fields-before-claim, no coverage guarantee, no legal advice, one-question-per-turn, injury escalation, prompt-injection resistance, final summary, empathy, no prompt leak, no action on a lapsed policy, and agent confirmation of critical details under ASR noise. Six scenarios × 12 checks = 72 assertions per full run.

npm run eval scores the fixed golden transcripts — fast, no network, a clean regression gate. npm run eval:llm runs the live model: --samples N reports a weighted pass-rate per check across N runs; --threshold T exits non-zero if any check falls below T; LPL_PROMPT_FILE lets a candidate prompt be evaluated without touching source. The runner runs a provider preflight before the first scenario, surfacing bad keys and billing errors up front instead of hiding them inside silent per-turn fallbacks.

An optional LLM judge scores nuance the rule-based checks miss — empathy quality, coverage-boundary phrasing, tone — using the evaluator prompt. It requires LLM mode. The rule-based scorecard remains the primary gate.

### Tradeoffs
The biggest tradeoff was determinism versus realism. A live LLM produces more dynamic conversations — but also introduces flakiness. The answer was to run both and be explicit about which produced each turn. The transcript banner makes the distinction unavoidable: a scorecard that looks good on fallback cannot be mistaken for a prompt that actually passes.

Another tradeoff was about what tool mocks should do. If a mock blocks a bad action, the agent looks better than it is. If the mock permits the action and the evaluator catches the violation, the system teaches you something. That principle generalizes well beyond insurance: let the agent act, record what happened, and evaluate against the workflow contract.

### Outcome
The result is a compact demo that makes one argument: prompts are only one part of an agent product.

The harder product work is defining the contract around the agent — what it may say, what it must not say, which tools it calls in which order, and when it hands off. And then building the tooling to catch regressions before they ship. That is what this lab is for.

### Key lessons
Failure visibility is more useful than failure prevention. A mock that hides a bad call produces a system that looks correct and isn't. A mock that allows the call and an evaluator that catches it produces a system you can actually improve.

The second lesson was about prompt and harness separation. Editable prompts break runners in ways that are hard to debug — wrong JSON, missing keys, invented argument shapes. Injecting the output contract and tool shapes from the harness, independently of the behavioral prompt, made iteration faster and made the failure mode obvious when it did occur.