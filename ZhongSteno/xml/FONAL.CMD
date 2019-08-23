@echo off
set di=%~dp0
%di:~0,1%:
cd %di%

sqlcmd -E -S ".\sqlexpress" -d tutorial -i fonal-bulk.sql -f 65001
bcp "exec dbo.spFonal" queryout "fonal.json" -S ".\sqlexpress" -d tutorial -T -t -c -C 65001

rem pause
rem bcp dbo.fonal format nul -x -f fmt..xml -n -T  -S ".\sqlexpress" -d tutorial -C 65001