# 10 - Plan

This lane is for detailed execution planning. No code should be written yet.

## AI Assistant Instructions

When working in this lane:
1. **Use Template**: Always use the `rollout-plan-template.md` to create a new rollout plan file.
2. **Docs-First Retrieval**:
   - Search the `docs/` folder for relevant specifications, ADRs, and guides.
   - Fill out the `Docs Impact` and `Docs-First Retrieval Checklist` sections of the plan.
   - If documentation is missing or insufficient, mark it as a risk.
3. **Verification Gates**: Define clear, machine-verifiable (tests, grep, tsc) gates for every phase.
4. **Dependency Rule**: Ensure each phase touches only one dependency layer (e.g., DB, then API, then UI).
5. **Review**: Present the plan to the user for approval.

## Spec-First Doc Integration

1. **Mandatory Docs Needed Declaration**: Implementation planning cannot begin without an explicit list of required docs and justifications in the `Docs Needed` table.
2. **Sufficiency Assessment**: Explicitly mark whether the identified docs are `Sufficient` or `Insufficient` for the planned task.
3. **Controlled Fallback**: If docs are insufficient, record why a fallback code scan is necessary and plan for its remediation in the `Docs Impact` section.

## Templates & Reference

- **[Rollout Plan Template](../templates/rollout-plan-template.md)**: The mandatory starting point for all implementation planning. Copy this to a new file in this directory to begin.
- **[Spec-First Kanban Integration Protocol](../../docs/operations/spec-first-kanban-integration.md)**: The enforceable contract for docs-first delivery.
