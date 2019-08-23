rem	bcp STAGE_HR_FEED in "j:\etl\sample\Sample Data 10-26.csv" -F2 -S localhost -d "_STUBS" -T -f hr.xml
bcp STAGE_HR_FEED in %1 -F2 -S localhost -d "_STUBS" -T -f hr.xml