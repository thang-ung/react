--select*from fonal order by glyph desc

--SET ANSI_NULL_DFLT_ON on

declare @dummy int=0;
;with cteg as(
	select*
		, k =row_number()over(partition by pyn order by @dummy)
	from fonal
)
,ctrange as(
	select i=1
	union all
	select i+1 from ctrange
	where i < 28
)
,cteglue as(
	select piny =pyn, i
	from ctrange
	  cross apply(select distinct pyn from fonal)T
)
,cteframi as(
	select glyph=isnull(glyph,''), pyn=piny, i
	from cteg
	 right join cteglue on piny=pyn and k=i
)
,ctepiv as(
	select*
	from cteframi
	pivot(min(glyph) for i in([1], [2], [3], [4], [5], [6], [7]
						,[8],[9],[10],[11],[12],[13],[14]
						,[15],[16],[17],[18],[19],[20],[21]
						,[22],[23],[24],[25],[26],[27],[28]--,[29]
						)
	)pvt
)
select*
from ctepiv
order by 1
/*
unpivot(
	glyf for cols in([1], [2], [3], [4], [5], [6], [7]
					,[8],[9],[10],[11],[12],[13],[14]
					,[15],[16],[17],[18],[19],[20],[21]
					,[22],[23],[24],[25],[26],[27],[28]--,[22]
					)
)upiv
*/

select distinct [match]
from fonal
  cross apply common.dbo.tmatchGroupstr(pyn, '/^([^aeiou]+)*([iu]){0,1}([áàǎāéèěēíìǐīóòǒōúùǔūaeiou]+)([^áàǎāéèěēíìǐīóòǒōúùǔūaeiou]+)*$/g')T
where igroup =3
order by 1
