## Find the MAX value with multiple logical criteria

In this example, we will find the maximum (MAX) value in a range where one or more of multiple criteria are met (IFS-OR)

### Full Matches
```
=MAX(ARRAYFORMULA(IF(OR(I:I = { B1, B2, B3 }), H:H, 0)))
```

* `MAX( [ ResultSet ] ))` <br />Return the maximum value (`MAX`) from the array `[ ResultSet ]`.
* [ ResultSet ] => `ARRAYFORMULA(IF(OR( ... ))` <br />If the value in Column I (`I:I`) matches any of the input values provided (`{ B1, B2, B3 }`), return the value from Column H (`H:H`) in the same row

### Partial Matches

```
=ARRAYFORMULA(
	MAX(IF(
		BYROW(
			ARRAYFORMULA(IFERROR(FIND({B1,B2,B3},I2:I22),0)>0),
			LAMBDA(data_row, ARRAYFORMULA(SUM(IF(data_row,1,0))))
		)>0,H2:H22,0)
	)
)
```
### Breakdown
* `ARRAYFORMULA(MAX(IF( [ ResultSet ] > 0, H2:H22, 0 )))` <br /> If the value in `[ ResultSet ]` is greater than zero, return the corresponding value for that row, from Column H
* [ ResultSet ] => `BYROW([ array1 ], [ LAMBDA function ])` <br /> Process the values in `[ array1 ]` row by row, and apply the `[ LAMBDA function ]` to each row.
* [ Array1 ] => `ARRAYFORMULA(IFERROR(FIND({B1,B2,B3},I2:I22),0)>0)` <br /> Check for each of the values in B1, B2, B3 within the strings in I2:I22.<br />If the string is found, return the character index (`FIND`).<br />Otherwise, return 0 (`IFERROR`).<br />Store this as `data_row`
* [ LAMBDA function ] => `LAMBDA(data_row, [ array2 ])` <br /> Perform the same function on everything in `[array2]`
* [ Array2 ] => `ARRAYFORMULA(SUM(IF(data_row,1,0)))` <br /> IF the value is TRUE, treat it as 1, otherwise treat it as 0. <br /> Then SUM the values in each row. Functionally, this is performing OR logic on the results of the FIND() function for each of the search strings. <br /> So if any of the strings is found in the target string, the value returned here will be greater than zero (which is treated as "TRUE")

***

[GoogleSheets Example file](https://docs.google.com/spreadsheets/d/1-cXdo--JpuE6_xXNyY-q4L1HNQUlXYzlk89iL0RDPRs)
