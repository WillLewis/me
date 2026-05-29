import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");
const apply = process.argv.includes("--apply");

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    let value = rawValue.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnvFile(resolve(repoRoot, ".env"));
loadEnvFile(resolve(repoRoot, ".env.local"));

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
}

const placeholderSlugs = [
  "rag-knowledge-copilot",
  "agent-workflow-builder",
  "vision-quality-inspector",
  "llm-eval-harness",
  "voice-meeting-summarizer",
  "personalization-bandit",
];

const projects = [
  {
    doc: "01_capital_one_neurosymbolic_multi_agent_operations_review.md",
    slug: "capital-one-neurosymbolic-multi-agent-operations-review",
    title: "Capital One - Neurosymbolic Multi-Agent Operations Review System",
    mediaPath: "/project-images/capital-one-agents.jpg",
    tagline:
      "A neurosymbolic multi-agent review system for high-volume operational workflows, separating evidence assembly, AI interpretation, deterministic controls, and human review.",
    tags: ["Agents", "LangGraph", "Weights & Biases"],
    metrics: [
      { label: "Review time", value: "-90%" },
      { label: "Workflow scale", value: "~1M / mo" },
      { label: "Use cases", value: "4 rails" },
    ],
  },
  {
    doc: "02_hpe_enterprise_rag_knowledge_search_platform.md",
    slug: "hpe-enterprise-rag-knowledge-search-platform",
    title: "HPE - Enterprise RAG / Knowledge Search Platform",
    mediaPath: "/project-images/hpe-rag-search.jpg",
    tagline:
      "A RAG-based enterprise knowledge assistant for HPE Brand Central and sales / partner documentation, built around reliable ingestion, retrieval, and grounded answers.",
    tags: ["RAG", "Retrieval", "LLM"],
    metrics: [
      { label: "Guide traffic", value: "-80%" },
      { label: "Clicked dwell", value: "+20%" },
      { label: "Support tickets", value: "-30%" },
    ],
  },
  {
    doc: "03_stanford_medicine_automated_medical_content_tagging.md",
    slug: "stanford-medicine-automated-medical-content-tagging",
    title: "Stanford Medicine - Automated Medical Content Tagging / Active Learning System",
    mediaPath: "/project-images/stanford-tagging.jpg",
    tagline:
      "An automated medical content-tagging system combining structured metadata signals with semantic understanding from a fine-tuned biomedical language model.",
    tags: ["XGBoost", "Active Learning", "NLP"],
    metrics: [
      { label: "Model quality", value: "+7%" },
      { label: "Tagging time", value: "-60%" },
      { label: "Annual savings", value: "~$400K" },
    ],
  },
  {
    doc: "04_reup_computer_vision_fraud_detection_marketplace_trust.md",
    slug: "reup-computer-vision-fraud-detection-marketplace-trust",
    title: "REUP - Computer Vision Fraud Detection for Marketplace Trust",
    mediaPath: "/project-images/reup-vision-ops.jpg",
    tagline:
      "A computer-vision and review-routing workflow for a C2B luxury marketplace, using image and metadata signals to route suspicious or high-confidence cases.",
    tags: ["Computer Vision", "CNN"],
    metrics: [
      { label: "Routing recall", value: "83%" },
      { label: "Backlog", value: "-75%" },
      { label: "Workflows", value: "-40%" },
    ],
  },
  {
    doc: "05_project_atlas_agentic_fraud_eval_safeguards_lab.md",
    slug: "project-atlas-agentic-fraud-eval-safeguards-lab",
    title: "Project Atlas - Agentic Fraud Eval & Safeguards Lab",
    mediaPath: "/project-images/project-atlas-eval-lab.jpg",
    tagline:
      "An adversarial testing lab where red-team agents search for weaknesses, defense agents propose fixes, and a deterministic judge decides what actually improves.",
    tags: ["Agents", "Evals", "Claude Code"],
    metrics: [
      { label: "Eval loop", value: "3 rounds" },
      { label: "Reviewer flow", value: "5 steps" },
      { label: "Status", value: "Phases 1-10" },
    ],
  },
  {
    doc: "06_voice_agent_prompt_lab_insurance_fnol_eval_harness.md",
    slug: "voice-agent-prompt-lab-insurance-fnol-eval-harness",
    title: "Voice Agent Prompt Lab - Insurance FNOL Voice Agent Evaluation Harness",
    mediaPath: "/project-images/voice-agent-lab.jpg",
    tagline:
      "A local-first prompt and evaluation lab for a voice agent across FNOL, policy servicing, escalation, and adversarial scenarios.",
    tags: ["Voice AI", "Evals", "Codex"],
    metrics: [
      { label: "Scenarios", value: "6" },
      { label: "Eval gate", value: "114/114" },
      { label: "Regressions caught", value: "5" },
    ],
  },
  {
    doc: "07_regulated_agent_launch_kit_ai_launch_readiness.md",
    slug: "regulated-agent-launch-kit-ai-launch-readiness",
    title: "Regulated Agent Launch Kit - AI Launch Readiness for Regulated Workflows",
    mediaPath: "/project-images/regulated-agent-readiness.jpg",
    tagline:
      "A deployment-readiness kit that turns workflow maps, traces, evals, regressions, approval gates, and redacted evidence packs into launch/no-launch recommendations.",
    tags: ["Agents", "Evals", "LangGraph", "Braintrust", "Claude Code"],
    metrics: [
      { label: "Recall @ limit", value: "4x" },
      { label: "Synthetic loss", value: "-62%" },
      { label: "Runtime eval", value: "10/10" },
    ],
  },
];

const copyPolish = [
  [/\bevertything\b/g, "everything"],
  [/\bchagpt\b/gi, "ChatGPT"],
  [/\bhavent\b/g, "have not"],
  [/\bdont\b/g, "do not"],
  [/\bI dont\b/g, "I do not"],
  [/\bIm\b/g, "I'm"],
  [/\blead the governance approval process\b/g, "led the governance approval process"],
  [/The cost was of missing and mislabeling/g, "The cost of missing and mislabeling"],
  [/All model detected fraud/g, "All model-detected fraud"],
  [/quality variance  that/g, "quality variance that"],
  [/our jobs as PMs is/g, "our job as PMs is"],
  [
    /A mock that hides a bad call produces a system that looks correct and isn't/g,
    "A mock that hides a bad call produces a system that looks correct and is not",
  ],
  [/I havent made this abundantly clear/g, "I have not made this abundantly clear"],
  [/I dont know/g, "I do not know"],
  [/can't/g, "cannot"],
  [/We're not doing that/g, "We are not doing that"],
];

function readDescription(doc) {
  const markdown = readFileSync(resolve(repoRoot, "docs", doc), "utf8");
  const writeupStart = markdown.indexOf("## Write-up");
  const summaryStart = markdown.indexOf("### Summary");
  const body =
    writeupStart >= 0
      ? markdown.slice(writeupStart).replace(/^## Write-up\s*/m, "")
      : markdown.slice(summaryStart >= 0 ? summaryStart : 0);
  return addDetailNotes(doc, lightPolish(body.trim().replace(/^### /gm, "## ")));
}

function lightPolish(markdown) {
  return copyPolish.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    markdown,
  );
}

function addDetailNotes(doc, markdown) {
  if (doc !== "07_regulated_agent_launch_kit_ai_launch_readiness.md") return markdown;

  const detail = `## Metric detail

**Recall @ limit:** judge-derived recall improved from 12.5% to 50.0%.

**Synthetic loss:** synthetic loss allowed fell from $2.22M to $850.5K.

`;

  return markdown.replace("## Problem", `${detail}## Problem`);
}

const records = projects.map((project, index) => ({
  slug: project.slug,
  title: project.title,
  tagline: project.tagline,
  description: readDescription(project.doc),
  tags: project.tags,
  metrics: project.metrics,
  media_url: project.mediaPath,
  media_type: "image",
  poster_url: null,
  order_index: index,
}));

if (!apply) {
  console.log("Dry run: pass --apply to write these CMS project records.");
  console.table(
    records.map(({ slug, title, tags, metrics, media_url }) => ({
      slug,
      title,
      tags: tags.join(", "),
      metrics: metrics.length,
      media_url,
    })),
  );
  process.exit(0);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const { data: upserted, error: upsertError } = await supabase
  .from("projects")
  .upsert(records, { onConflict: "slug" })
  .select("id, slug, title");

if (upsertError) throw upsertError;

const projectIds = upserted.map((project) => project.id);
if (projectIds.length) {
  const { error: linkDeleteError } = await supabase
    .from("project_links")
    .delete()
    .in("project_id", projectIds);
  if (linkDeleteError) throw linkDeleteError;
}

const { error: placeholderDeleteError } = await supabase
  .from("projects")
  .delete()
  .in("slug", placeholderSlugs);

if (placeholderDeleteError) throw placeholderDeleteError;

console.log(`Seeded ${upserted.length} CMS project records.`);
for (const project of upserted) {
  console.log(`- ${project.slug}: ${project.title}`);
}
