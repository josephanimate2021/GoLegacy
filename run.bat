:: Installation
@echo off && cls
taskkill /f /im node.exe
if not exist node_modules ( npm install &&  npm start ) else ( 
        :: start golegacy
        npm start
        pause
)

