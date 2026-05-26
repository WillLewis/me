ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS metrics jsonb NOT NULL DEFAULT '[]'::jsonb;

UPDATE public.projects SET metrics = '[{"label":"Retrieval recall@10","value":"+14pp"},{"label":"P95 latency","value":"-38%"},{"label":"Index cost","value":"+11%"}]'::jsonb WHERE slug = 'rag-knowledge-copilot';
UPDATE public.projects SET metrics = '[{"label":"Teams onboarded","value":"12"},{"label":"Workflow build time","value":"-71%"},{"label":"Activation w1","value":"+22pp"}]'::jsonb WHERE slug = 'agent-workflow-builder';
UPDATE public.projects SET metrics = '[{"label":"Defect escape rate","value":"-46%"},{"label":"Inspector throughput","value":"+3.1x"},{"label":"FP rate","value":"<0.8%"}]'::jsonb WHERE slug = 'vision-quality-inspector';
UPDATE public.projects SET metrics = '[{"label":"Regression catch","value":"+40%"},{"label":"Eval runtime","value":"-63%"},{"label":"Eval cost / run","value":"-58%"}]'::jsonb WHERE slug = 'llm-eval-harness';
UPDATE public.projects SET metrics = '[{"label":"Summary accept rate","value":"86%"},{"label":"Edit distance","value":"-44%"},{"label":"WER (noisy)","value":"7.2%"}]'::jsonb WHERE slug = 'voice-meeting-summarizer';
UPDATE public.projects SET metrics = '[{"label":"CTR lift","value":"+9.4%"},{"label":"Revenue / session","value":"+6.1%"},{"label":"Cold-start time","value":"-52%"}]'::jsonb WHERE slug = 'personalization-bandit';