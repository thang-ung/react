if exists(select* from dbo.sysobjects where id = object_id(N'dbo.spClearFluxStageADP') and OBJECTPROPERTY(id, N'IsProcedure') = 1)
begin
	drop procedure dbo.spClearFluxStageADP
	PRINT 'PROCEDURE: spClearFluxStageADP DROPPED'
end
GO
create procedure dbo.spClearFluxStageADP(@interval varchar(1) ='d')
as
begin
	delete STAGE_HR_FEED
	where stamp < dateadd(m, datediff(m,0,getdate())-3, 0); --over than three months

	--end of period
	declare @eop datetime =(case @interval when 'd' then dateadd(d, datediff(d,0, getdate()), 0) -0
						else dateadd(wk, datediff(wk,0, getdate()), 0) -2
						end);
	--the sunday starting the period
	declare @sunday datetime =dateadd(wk, datediff(wk,0, @eop), 0) -1

	print 'clear out staged data between '+ convert(varchar,@sunday,121) +' to '+ convert(varchar,@eop,121);
	delete STAGE_HR_FEED
	where [DateWorked] between @sunday and @eop;

end--spClearFluxStageADP
go


IF @@ERROR = 0 PRINT 'PROCEDURE: spClearFluxStageADP CREATED'
ELSE PRINT 'ERROR CREATING PROCEDURE spClearFluxStageADP'
go

--exec spClearFluxStageADP 'w'

--print dateadd(m, datediff(m,0,getdate())-3, 0)
