@cd %~dp0..
if not exist node_modules npm install
node server/app
pause
