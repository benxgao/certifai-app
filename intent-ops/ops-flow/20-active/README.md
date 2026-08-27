# 20 - Active

This lane is for execution and implementation.

## AI Assistant Instructions

When working in this lane:
1. **Incremental Execution**: Follow the rollout plan phase by phase. Do not skip ahead.
2. **Update Progress**:
   - Update the `Progress Dashboard` in the plan file as you complete items.
   - Use `[~]` for in-progress and `[x]` for completed/verified.
3. **Session Notes**: At the end of every interaction, append a `Session Note` to the plan file with current status, next steps, and blockers.
4. **Decision Log**: Record any trade-offs or decisions made during implementation in the plan's `Decision Evidence Log`.
5. **Verify**: Run the verification gate for the current phase before moving to the next.

## Spec-First Doc Integration

1. **Decision Evidence Mandatory**: Every major implementation decision must cite a canonical doc in the `Decision Evidence Log`.
2. **Fallback Scan Justification**: If you must rely on code-scanning because docs are missing or outdated, you MUST record this in the log.
3. **Traceable Implementation**: Ensure that your changes are consistent with the "Source of Truth" documents cited in the plan.

## Templates & Reference

- **[Rollout Plan Template](../templates/rollout-plan-template.md)**: Reference this to ensure you are following the required phase structures and verification gates.
