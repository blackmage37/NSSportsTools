```
Qus — 30/03/2022 08:18
What do you do if you need to break a tie with a RANK function?
```
```
Uncle Os [AVFC],  — 30/03/2022 08:18
SUMPRODUCT
you need to know where the tiebreaking value is first
```
```
Qus — 30/03/2022 08:19
Oh. Researching SUMPRODUCT actually gives me a much more elegant solution to something
completely different I was doing a few days ago.
```
```
Uncle Os [AVFC],  — 30/03/2022 08:20
=SUMPRODUCT(([rank column]=rank)*([tiebreaker column]>tiebreak value))
would break the tie on the tiebreaker value where larger values are ranked higher
you can chain these too because it uses AND logic.
multiplication of TRUE/FALSE (1s and 0s) values will only ever result in TRUE/FALSE (1/0)
and all of them will need to be TRUE for the function to yield a TRUE result (because
anything multiplied by 0 = 0; meaning the second one criteria doesnt match, you get a false
result)

this is actually how i first learned about array handling in excel fwiw 
so in this case, you'll get 0s when the rank isnt tied, which means everything outputs to 0
where the rank isnt tied
but if the rank is tied, you'll get 1s in those positions. that then gets multiplied by the
1 or 0 depending on whether the second array result is TRUE/FALSE
if you sum those values with the original rank, it should give a "correct" rank value that
puts everyone in order 
theres almost always one of these in the standings sheets i make. sometimes going as long as
like... ten criteria.
```
```
Qus — 30/03/2022 08:29
Oh, so if I understand right, it'll be something like =SUMPRODUCT(($T:$T=$T2)*($E:$E>$E2)),
& if the ties are broken somewhere, that'll output to false/0, so it'll automatically spit
out 0 since that's what happens when you multiply by zero — but if the ties aren't broken
by anything, it'll output as true/1, & 1*1=1.
```
```
Uncle Os [AVFC],  — 30/03/2022 08:32
sort of. the second criteria is doing the actual tiebreaking, so the first ranked one will
output a zero as well
everyone else will be 1*(however many teams are ranked above them)
assuming E is goals scored, for example, 
if Team A, B, and C are all ranked 1st and all have 10 points, they all get a 1 in the first
array.
then whoever scored most goals of the three of them will get a zero in the second array
because no other team with a 1 in the first array will have more goals
second highest goals scored will return a 1, and the third will return 2... etc

adding those values to their original rank (by points) will sort them in order
```
```
Qus — 30/03/2022 08:36
Oh. So ($T:$T=$T2) is the true/1 v. false/0 bit, & ($E:$E>$E2) means "how many of these have
bigger E values than this row's"?
(In the example =SUMPRODUCT(($T:$T=$T2)*($E:$E>$E2))?
```
```
Uncle Os [AVFC],  — 30/03/2022 08:38
yes. so if you need multiple criteria, you need a column for each, and only the last array
does the comparison. all the others would have to be equal to
```
```
Qus — 30/03/2022 08:40
Okay. & let's say you have three clubs tied for 12th, & the first array successfully breaks
the tie. The top club in the tiebreaker would have 0, the next would have 1, & the one after
that would have 2, so you'd just add those values to the original 12 to get 12th, 13th, &
14th, respectively, right?
```
```
Uncle Os [AVFC],  — 30/03/2022 08:42
yes
```
