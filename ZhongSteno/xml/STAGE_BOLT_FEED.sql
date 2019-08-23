
if exists(select 1 from sys.tables where name='STAGE_BOLT_FEED')
begin
	drop table STAGE_BOLT_FEED;
	PRINT 'TABLE: STAGE_BOLT_FEED DROPPED'
end

create table STAGE_BOLT_FEED(
	  invoiceDate datetime
	, invoiceNo nvarchar(40)
	, fleetLocation nvarchar(40)
	, loadNo nvarchar(64)
	, customer nvarchar(256)
	, lineHaul integer
	, miles float
	, shipper nvarchar(256)
	, shipperDate datetime
	, stamp datetime default(dateadd(d, datediff(d,0, getdate()), 0))

	,PRIMARY KEY(invoiceNo
		,loadNo
		,customer
		,stamp)
	,unique(customer,InvoiceNo)
	--WITH(IGNORE_DUP_KEY=ON)
);
go
IF @@ERROR = 0 PRINT 'TABLE: STAGE_BOLT_FEED CREATED'
ELSE PRINT 'ERROR CREATING TABLE STAGE_BOLT_FEED'
go


--
select rx=common.dbo.regexReplace(customer,'/^(.*?\(([^\)]*?)\)[''"]*|(.*))$/i','$2$3'), *from STAGE_BOLT_FEED order by 1 desc
--print dateadd(d,0, datediff(d,0, getdate()))
/*
declare @d as datetime ='10/11/2015'
print dateadd(wk, datediff(wk,0, @d), 0) -2

print datediff(wk,'1/1/2015', getdate())

weekly:	dateadd(wk, datediff(wk,0, getdate()), 0) -2
daily: dateadd(wk, datediff(wk,0, getdate()), 0) -1

print dateadd(d, datediff(d,0, getdate()), 0) -1

*/
