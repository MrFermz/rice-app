@echo off

set dir=node_modules

if exist %dir% (
	start cmd /k api
	npm start
)
if not exist %dir% (
	npm i
	start cmd /k api
	npm start
)