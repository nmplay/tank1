@cd %~dp0..
call heroku logs --tail | node -e process.stdin.pipe(process.stdout);
pause
