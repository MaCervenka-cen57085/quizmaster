# AI Guardrails

## Core Message

**Always point AI agents to `.ai-instructions/` folder for project-specific commands.**

## Quick Start

1. **Check `.ai-instructions/`** to understand how the AI-agents are expected to respond to the instructions
2. **Use the commands** in your prompts to create consistent results with minimal words
3. **Ask AI to add new instructions** when you repeat the same request, ask the agent to "Update .ai-instructions for <the process we just used>"

## Adding New Instructions

When you find yourself repeatedly explaining the same process:

1. **Instruct your AI agent**: "Update .ai-instructions for <the process we just used>"
2. Agent creates file in `.ai-instructions/[task-name].md`
3. Agent includes: Command, Algorithm, Example
4. Use exact command phrase in future requests
5. Experiment with your agent, feeding it your feedback so it can improve its instructions

## Standard Commands

- **Update**: "Update .ai-instructions for <the process we just used>"
- **Check**: "Check .ai-instructions"

## Template

```markdown
# [Task Name] Instructions

## Command
**"[Exact command phrase]"**

## Algorithm
1. Step 1
2. Step 2
3. Step 3

## Example
[Input → Output]
```
