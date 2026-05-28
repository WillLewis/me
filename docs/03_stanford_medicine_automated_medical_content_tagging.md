# Stanford Medicine — Automated Medical Content Tagging / Active Learning System

## 3 KPIs / Key Results

- **Model quality:** F1 improved from 85% to 92%
- **Editor workflow:** Manual tagging time reduced by 60%
- **Business impact:** ~$400K annual savings in editor time

## What it does

An automated medical content-tagging system for Stanford Medicine content across multiple CMS platforms. It combines structured metadata signals with semantic understanding from a fine-tuned biomedical language model to recommend tags for healthcare content editors.

The system was designed as an assistive workflow, not a full editor replacement. Editors stayed in the loop, and their corrections helped improve the model over time through an active learning process.

## My role

I led the product work across data science, engineering, editors, and medical domain experts. I helped structure the problem, defined the success metrics, shaped the ground-truth dataset, aligned the team on model-selection tradeoffs, and made sure the workflow was trusted by editors.

A large part of the PM work was around ambiguity. Medical tagging can be subjective, so we needed to understand where experts agreed, where they disagreed, and how much disagreement the system should tolerate.

## Outcome

The system reduced manual tagging time by 60%, saved roughly $400K annually, and improved content engagement by 25%.

## Write-up

### Summary

At Stanford Medicine, I led the build of a ML product that automated medical content tagging across multiple CMS platforms. The goal was to improve content discoverability while reducing the manual tagging burden on editors.

The system combined structured metadata modeling with domain-specific language understanding. It improved F1 from 85% to 92%, reduced manual tagging time by 60%, saved roughly $400K annually, and increased content engagement by 25% (as measured against control segment).

### Problem

Stanford Medicine had a large content ecosystem serving about 1.7M monthly active users. Editors were spending 15–20 hours per week on tagging, and the process was inconsistent across CMS platforms.

The problem was not just operational. Poor tagging created downstream discoverability problems.

This was also a domain where trust mattered. Medical content has specialized terminology, and editors needed to understand why a tag was recommended. A generic black-box classifier would not have been enough.

### Approach

We treated the project as an assistive ML workflow, not as a full editor replacement.

The model recommended tags, editors stayed in the loop, and their corrections fed back into the system through an active learning pipeline.

The architecture combined two model families.

**XGBoost for structured metadata**

This handled tabular and metadata signals: content type, taxonomy, source, authoring patterns, existing labels, and other structured features.

**Fine-tuned BERT / sciBERT for semantic understanding**

This handled unstructured medical language. We needed a model that could understand domain-specific terminology better than a generic text classifier. Fine-tuning a biomedical / scientific language model helped the system interpret medical concepts and related terms more accurately.

The ensemble approach worked because the two models were good at different things. The structured model captured explicit metadata patterns. The language model captured semantic meaning.

### My role

I led the product work across data science, engineering, editors, and medical domain experts.

My role included structuring the problem, defining the success metrics, helping shape the ground-truth dataset, aligning the team on model-selection tradeoffs, driving execution and making sure the workflow would be trusted by editors.

Tagging can be subjective, so we needed to understand where experts agreed, where they disagreed, and how much disagreement the system should tolerate. We used editor-reviewed data as ground truth and included expert validation in the evaluation process.

### Evaluation

The model had to clear two bars: model performance and user trust.

The quantitative metrics were precision, recall, and F1. We placed strong emphasis on recall because missing important tags could hurt discoverability. The final model reached roughly 93% precision, 91% recall, and 92% F1 on a holdout test set.

We also used expert validation, interoperator agreement, user acceptance testing, and latency constraints. Editors needed the system to feel like a helpful assistant, not another tool they had to fight.

### Tradeoffs

The biggest tradeoff was model complexity versus editor trust. A more complex model could improve accuracy, but if editors could not understand or influence the output, adoption would suffer.

That is why the active learning loop mattered. It turned editor corrections into a product feature instead of treating them as one-off overrides.

Another tradeoff was recall versus precision. In this domain, missing an important tag could hurt discoverability, but too many bad suggestions would create editor fatigue. The system needed to be useful enough that editors wanted to keep it in their workflow. The cost was of missing and mislabeling was established as roughly the same in the absence of more data -- hence the F1 choice.

### Outcome

The product reduced manual tagging time by 60%, which translated to roughly $400K in annual savings. It also improved content engagement by 25%, which mattered because the real purpose of the project was better content discovery, not just internal efficiency.


### What I learned

This was an opportunity to work on a workflow where accuracy and explainability were both product requirements.

A model can be technically strong and still fail if users do not trust it. The active learning loop was important because it turned editor corrections into a system-improvement mechanism.

