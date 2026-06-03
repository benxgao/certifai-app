# 30 - Review

This lane is for final verification, documentation sync, and executive reporting.

## AI Assistant Instructions

When working in this lane:
1. **Mandatory Closing Phases**: Complete the `Docs Sync`, `AI-ready reflection`, and `Docs-only Simulation Drill` phases.
2. **Final Score**: Execute the `Rollout Eval & Health Score` phase and record the final score.
3. **Executive Summary**: Create a `final-summary.md` (or similar) using the `executive-report-template.md`.
4. **Cleanup**: Ensure all temporary files are removed and links between documents are working.
5. **Link Integrity**: Verify that `docs/ai/assistant-context-index.md` is updated if new docs were added.

## Spec-First Doc Integration

1. **Same-Rollout Remediation**: If a fallback code scan was used during implementation, the corresponding docs MUST be updated in the same rollout (or a follow-up item must be created with an owner and due date).
2. **Simulation Drill**: Execute a "Docs-only Simulation Drill" to prove the implementation can be replicated from documentation alone.
3. **Health Score**: Calculate the `Rollout Eval & Health Score`, giving significant weight (40/120 points) to docs-first adherence and doc health.

## Templates & Reference

- **[Executive Report Template](../templates/excutive-report-template.md)**: Use this for final delivery summaries and leadership handoffs.
- **[Rollout Plan Template](../templates/rollout-plan-template.md)**: Reference your active plan's closing phases for verification gates.
