Function WRAND(rngList As Range, rngWeights As Range)

Dim iRand As Long
Dim i As Long
Dim rTotal As Long
Dim arrList As Variant
Dim arrWt As Variant

arrList = Application.Transpose(rngList)
arrWt = Application.Transpose(rngWeights)

maxWt = WorksheetFunction.Sum(rngWeights)
iRand = Int(Rnd * (maxWt - 0) + 0)

rTotal = 0

' loop through list of items
For i = 1 To rngList.Count

    rTotal = rTotal + arrWt(i)
    If iRand <= rTotal Then GoTo breakLoop

Next i

breakLoop:
WRAND = arrList(i)

End Function
