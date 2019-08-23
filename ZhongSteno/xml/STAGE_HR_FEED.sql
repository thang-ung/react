
if exists(select 1 from sys.tables where name='STAGE_HR_FEED')
begin
	drop table STAGE_HR_FEED;
	PRINT 'TABLE: STAGE_HR_FEED DROPPED'
end

create table STAGE_HR_FEED(
	 [EmployeeStartDate] datetime
	, [EmployeeName] nvarchar(128)
	, [DateWorked] datetime
	, [Year] smallint
	, [WeekNumber] tinyint
	, [PayType] nvarchar(128)
	, [Location1] nvarchar(128)
	, [Location2] nvarchar(128)
	, [Area1] nvarchar(128)
	, [Area2] nvarchar(128)
	, [Department] nvarchar(128)
	, [Manager] nvarchar(128)
	, [FirstPunch] datetime
	, [LastPunch] datetime
	, [HoursType] nvarchar(128)
	, [Hours] decimal(6,3)
	, [AvgRate] decimal(14,3)
	, [Ext.Amount] decimal(14,3)
	, stamp datetime default(dateadd(wk, datediff(wk,0, getdate()), 0) -2)

	,PRIMARY KEY([EmployeeStartDate]
	, [EmployeeName]
	, [DateWorked]
	, [Year]
	, [WeekNumber]
	, [HoursType]
	, [LastPunch]
	, stamp)
	WITH(IGNORE_DUP_KEY=ON)
);
go
IF @@ERROR = 0 PRINT 'TABLE: STAGE_HR_FEED CREATED'
ELSE PRINT 'ERROR CREATING TABLE STAGE_HR_FEED'
go


--select*from STAGE_HR_FEED order by 3 desc
--print dateadd(d,0, datediff(d,0, getdate()))
/*
declare @d as datetime ='10/11/2015'
print dateadd(wk, datediff(wk,0, @d), 0) -2

print datediff(wk,'1/1/2015', getdate())

weekly:	dateadd(wk, datediff(wk,0, getdate()), 0) -2
daily: dateadd(wk, datediff(wk,0, getdate()), 0) -1

*/

print dateadd(d, datediff(d,0, getdate()), 0) -1
