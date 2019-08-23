truncate table dbo.fonal;
go

BULK INSERT dbo.fonal
FROM 'U:\jillizm\xml\fonal.dat'
WITH(firstrow=2
	,codepage='1200'
	,FORMATFILE='U:\jillizm\xml\fonal-fmt.xml'
--	,datafiletype='widechar'
	,ROWTERMINATOR ='\n\0'
);
go

-- glyph are larger than two bytes
insert into dbo.fonal values(N'𨊰',N'qì')


--select*from dbo.fonal;
