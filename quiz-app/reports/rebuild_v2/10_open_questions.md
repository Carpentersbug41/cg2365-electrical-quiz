# Open Questions

Last updated: 2026-03-06

## Product Questions

- What is the first commercial slice: one institution, one curriculum, or one qualification family? - one curriculum should be first
- Is V2 primarily a learner platform, an operator platform, or both from day one? - learner platform
- Which current features are genuinely differentiating versus distracting? - Discuss with me

## Technical Questions

- Single deployable modular monolith first, or early service split? - single
- Postgres/Supabase remains system of record, or move to another operational stack? - I think keep supabase for now
- What queue/job runner will own generation workflows? - you decide
- What content editor model will be used for lesson blocks?   1. Keep only semantic structure                                    
                                                                     
  - headings, paragraphs, lists, tables, block separators            
  - no color classes, gradients, shadows, animation, custom fonts    
                                                                     
  2. Keep presentation decoupled                                     
                                                                     
  - lesson JSON/block schema unchanged                               
  - runtime renders semantic HTML per block type                     
  - add a single wrapper class (for example content-shell) so styling    can be layered later without changing logic  

## Content Questions

- What is the exact draft/review/publish lifecycle for lessons?
- What approval threshold is required before AI-generated content becomes publishable?
- Which existing lesson/question assets are clean enough to migrate directly?

## Runtime Questions

- What mastery rule is the actual v2 rule, not just a prototype heuristic?
- Which gating behaviors remain mandatory in v2?
- How much personalization belongs in the first release?

## Reporting Questions

- Which metrics matter to institutions enough to drive adoption?
- Which metrics are reliable enough to expose in production dashboards?
- What event schema must be fixed before implementation begins?

