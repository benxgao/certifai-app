# 00 - Intake

This lane is for capturing new initiatives, ideas, and bug reports.

## AI Assistant Instructions

When working in this lane:
1. **Explore & Brain-dump**: Help the user articulate their goal. Ask clarifying questions to surface hidden constraints or risks.
2. **Structure**: Turn the raw input into an **Initiative Brief** (use the template if available, or create a structured summary).
3. **Assess Risk**: Identify potential blast radius and assign a risk level (Low/Medium/High).
4. **Define Phases**: Break the initiative into logical, independently verifiable phases.
5. **Move to Plan**: Once the goal and phases are clear, move the artifact to `10-plan`.

## Spec-First Doc Integration

1. **Mandatory Docs-First Start**: Before proposing scope, search `docs/` for relevant specifications, ADRs, or domain guides.
2. **Context Discovery**: Use `docs/ai/assistant-context-index.md` to identify high-level systems and owners related to the request.
3. **Traceability**: If the request references a known system, verify its documentation status early.

## Templates & Reference

- **[Rollout Plan Template](../templates/rollout-plan-template.md)**: Once the goal is clear, this template will be used in the `10-plan` phase to define execution.
