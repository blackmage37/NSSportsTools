## Using ArrayFormula to mimic QUERY

ArrayFormula can be used to mimic QUERY by returning only values which meet certain criteria, as seen in the image below

![Screenshot showing an implementation of ArrayFormula acting like a simple QUERY](<../../Formula Examples & Breakdowns/images/ArrayFormula_Query.png> "ArrayFormula / QUERY example")

```
=ArrayFormula(TEXTJOIN(",", TRUE, IF(B:B="Stadium A", A:A, "")))
```

Breaking this down into parts, we get the following:
* `IF(B:B="Stadium A", A:A, "")` - Where the value in column B (`B:B`) is equal to `"Stadium A"`, return the value in the same row, in column A (`A:A`)
* `TEXTJOIN(",", TRUE, [Array] )` - Take each of the values in `[Array]` (in this case, the results of the `IF` statement) and concatenate them with `","`, ignoring blanks (this is what the `TRUE` parameter does)
* `ArrayFormula()` - Treat the entire thing as an array

Without the `ArrayFormula` wrapper, GoogleSheets would try to resolve this as a single value, meaning `B:B` will throw an error because it isn't a single cell. 

In some spreadsheet softwares, this would be automatically converted and passed as a single cell (typically just the first value in the range specified, so in this case `B1`).
