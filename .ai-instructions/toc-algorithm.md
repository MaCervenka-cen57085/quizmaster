# TOC Algorithm Instructions

## Commands
- **"Update TOC"** - Keep same number of columns (extract from existing TOC)
- **"Update TOC in [X]-column format"** - Change to specified number of columns

## Algorithm

### For "Update TOC" (keep same columns):
1. **Count existing columns** in current TOC table
2. **Sort all chapters alphabetically** in the document
3. **Calculate row_depth**: `ceil(total_chapters / number_of_columns)`
4. **Fill each cell** using formula: `item((col_index * row_depth) + row_index)` if exists, else empty
5. **Update the TOC table** with the calculated distribution

### For "Update TOC in [X]-column format":
1. **Sort all chapters alphabetically** in the document
2. **Calculate row_depth**: `ceil(total_chapters / X)`
3. **Fill each cell** using formula: `item((col_index * row_depth) + row_index)` if exists, else empty
4. **Update the TOC table** with the calculated distribution


## Example
For 10 chapters in 3 columns:
- row_depth = ceil(10/3) = 4
- Row 1: item(1), item(5), item(9)
- Row 2: item(2), item(6), item(10)
- Row 3: item(3), item(7), empty
- Row 4: item(4), item(8), empty

## Notes
- col_index is zero-based (0, 1, 2, ...)
- row_index is one-based (1, 2, 3, ...)
- item numbers are one-based (1, 2, 3, ...)
