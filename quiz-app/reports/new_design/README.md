# Guided Chunk Platform Docs

This folder contains the canonical documentation for the new guided lesson runtime.

Audience:
- builder / engineer
- technical lead
- AI agent consuming the system docs later

Start here if you have no context.

## Reading Order

1. [handbook.md](./handbook.md)
2. [dynamic_guided_runtime_v2.md](./dynamic_guided_runtime_v2.md)
3. [separate_dynamic_module_rebuild.md](./separate_dynamic_module_rebuild.md)
4. [prompt_pattern_to_superior_product.md](./prompt_pattern_to_superior_product.md)
5. [generation_pipeline_spec.md](./generation_pipeline_spec.md)
6. [implementation_spec.md](./implementation_spec.md)
7. [telemetry_and_analysis_spec.md](./telemetry_and_analysis_spec.md)
8. [ai_improvement_system.md](./ai_improvement_system.md)
9. [research_basis.md](./research_basis.md)
10. appendices as needed

## Canonical Docs

- `handbook.md`: product vision, architecture, learner/app measurement model, v1 boundaries
- `dynamic_guided_runtime_v2.md`: current rebuild direction for the simpler LLM-led guided runtime
- `separate_dynamic_module_rebuild.md`: hard separation rule and new namespace for the ground-up rebuild
- `prompt_pattern_to_superior_product.md`: what the prompt benchmark is teaching us and how the app should respond
- `generation_pipeline_spec.md`: separate guided generation pipeline, sequential chunk generation, subject profiles, and `guided_chunk_frame` output contract
- `implementation_spec.md`: decision-complete build spec for `guided_chunk_v1`, versioned guided content, and guided-only admin workflow
- `telemetry_and_analysis_spec.md`: canonical telemetry, inference, and analysis model
- `ai_improvement_system.md`: how AI analyzes data and proposes or applies bounded app changes
- `research_basis.md`: research synthesis organized by design decision

## Appendices

- `appendix_backlog.md`: milestone and ticket backlog for v1
- `appendix_report_template.md`: standard AI improvement report template
- `appendix_change_log_template.md`: standard record for shipped changes and outcomes
- `appendix_glossary.md`: terminology

## Supporting Notes

Older working documents have been retained in [`supporting_notes/`](./supporting_notes/). They are source material and history, not the canonical entry point.

## Core Idea In One Paragraph

The platform delivers lessons through a constrained conversational runtime. Lesson structure is pre-generated and grounded to the curriculum, but delivery feels dynamic: the learner receives one short teaching chunk at a time, responds in the same tutor thread, gets repair when needed, and progresses through a measured learning loop. The system records both learner performance and app performance so the product can be improved over time by an AI operating inside explicit pedagogic and product constraints.

Current implementation notes:
- guided authoring is separated from the old static lesson workflow
- guided lessons are versioned independently with `draft`, `needs_review`, `approved`, `published`, and `retired` states
- grading reports are stored and reviewed in guided admin so the generator can be iteratively tightened by evidence
- the same generator engine is shared across subjects, but subject-specific refinement layers now exist, including a dedicated `cg2365` refinement path
