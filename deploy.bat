@echo off

set dir=public

rem setup
rmdir %dir% /s /q
mkdir %dir%
pushd %dir%

rem clone
git clone -b master https://github.com/jsmolka/jsmolka.github.io .
git rm -r *

rem build
hugo -s .. -d %dir%
cmd /c npm run prism

rem commit
git add .
git commit -m "update site"
git push origin master

rem cleanup
popd
rmdir %dir% /s /q
