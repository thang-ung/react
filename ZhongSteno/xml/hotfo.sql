declare @s nvarchar(max) =N'
我你的是不了一这人么有就在来他要个们子可
为上还也那说什都大好到后会道天去下她过以
得知心之事想能如啊没出看娘吗王然自皇给无
真时生儿怎里才明死宫当回着见只对再日女吧
让此小样今何多家呢情师身所意把本门做亲山
太书已和年现地主些定成而经跟中十别从您便
哪杀用父先若话前起果被己将但该手又相命头
少西难应走呀夫行位最姐很谁听三找竟开面国
神候教于法正气院老传实长公路世快问点请伤
信入受清万等必弟发眼打离府刚进剑姑带原害
二干活名兄奴错怕分管爷重方算口城与因放总
间东官殿远早安喜魔光底宗秦外关敢哥次住直
两爱者吃却贵珞更任留非像办几九言全曾字救
妃未战倒臣罪璎夜永落白修武送连爹朱高求欢
动花比待告派母且边诉反认桑学军功妾至皮理'
	,@i int=0
	,@k int =7;

;with cte as(
	select k=row_number()over(order by @i)
		,c=row_number()over(order by @i) % @k
		, *
	from common.dbo.tmatchGroupstr(@s, '/([^ \t\n\r])/g')
)
,cteg as(
select c, match
	,r=(cast((k-1)/@k as integer) +1) *@k--, *
from cte
)
select--*--, ln=r/@k
	[1], [2], [3], [4], [5], [6], /*[7], */[0], r
from cteg
pivot(min(match) for c in ([1], [2], [3], [4], [5], [6], /*[7], */[0])
)pvt
where [0] is not null
order by r


;with cte as(
	select k=row_number()over(order by @i), *
	from common.dbo.tmatchGroupstr(@s, '/(.)/g')
)
select k, fo.*
from cte join fonal fo on fo.glyph =cte.match
order by 3,1;
/*
都
时
只
让
身
意
成	定	又
*/

select*from common.dbo.tmatchGroupstr('兛	qian1 ke4', '/^(.)([\t ]((([mr])([1-6])|([^aeiou]+)*(u\:|[iuü]){0,1}(u\:|[aeiouüv]+)([^aeiouüv]+)*([1-6])))+)$/ig')
