# Update Instructions Command

## Command
**"Update .ai-instructions for <the process we just used>"**

## Algorithm
1. **Identify the process** that was just completed
2. **Create descriptive filename** using kebab-case: `[process-name].md`
3. **Follow the standard template** with all required sections
4. **Place file** in `.ai-instructions/` folder
5. **Update README.md index** with new command entry
6. **Ensure consistency** with existing instruction format

## Template
```markdown
# [Process Name] Instructions

## Command
**"[Exact command phrase]"**

## Algorithm
1. **Step 1**: Description
2. **Step 2**: Description
3. **Step 3**: Description

## Example
[Concrete example with input/output]

## Notes
- Important details
- Edge cases
- Dependencies
```

## Example
**Input**: "Update .ai-instructions for the TOC sorting process we just used"

**Output**: Creates `toc-algorithm.md` with:
- Command: "Sort chapters and update TOC in [X]-column format"
- Algorithm: Mathematical formula for column distribution
- Example: 10 chapters in 3 columns
- Notes: col_index zero-based, row_index one-based

## Notes
- Use kebab-case for filenames
- Keep commands concise and memorable
- Include concrete examples
- Follow existing instruction format exactly
