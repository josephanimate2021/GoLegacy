@echo off
taskkill /f /im node.exe
if not exist node_modules ( 
        npm install 
        npm start
        pause 
) else ( 
        npm start 
        pause
)

