WITH safe_placeholders(slug, title) AS (
  VALUES
    ('rag-knowledge-copilot', 'Placeholder Case Study 01'),
    ('agent-workflow-builder', 'Placeholder Case Study 02'),
    ('vision-quality-inspector', 'Placeholder Case Study 03'),
    ('llm-eval-harness', 'Placeholder Case Study 04'),
    ('voice-meeting-summarizer', 'Placeholder Case Study 05'),
    ('personalization-bandit', 'Placeholder Case Study 06')
)
UPDATE public.projects
SET
  title = safe_placeholders.title,
  tagline = 'Demo slot for layout and CMS testing. Replace with a verified project before sharing.',
  description = '## Placeholder notice

This case study is sample content for layout, routing, and CMS QA. It does not describe a real project, employer, customer, model result, shipped feature, or business outcome.

## Replace with

- The real problem and audience.
- Your role, scope, and decisions.
- The constraints, tradeoffs, and implementation path.
- Verified outcomes, links, and screenshots you are comfortable publishing.',
  tags = ARRAY['Placeholder', 'CMS', 'Draft'],
  metrics = '[
    {"label":"Content status","value":"Draft"},
    {"label":"Claims","value":"None"},
    {"label":"Next step","value":"Replace"}
  ]'::jsonb,
  updated_at = now()
FROM safe_placeholders
WHERE public.projects.slug = safe_placeholders.slug;

DELETE FROM public.project_links
USING public.projects
WHERE public.project_links.project_id = public.projects.id
  AND public.projects.slug IN (
    'rag-knowledge-copilot',
    'agent-workflow-builder',
    'vision-quality-inspector',
    'llm-eval-harness',
    'voice-meeting-summarizer',
    'personalization-bandit'
  );
