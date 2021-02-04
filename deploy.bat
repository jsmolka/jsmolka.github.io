@echo off

set dir=public

rem setup
rmdir %dir% /s /q
mkdir %dir%
pushd %dir%

rem clone
git clone --depth 1 -b master https://github.com/jsmolka/jsmolka.github.io .
git rm -r *

rem build
hugo -s .. -d %dir%
cmd /c npm run prism

rem commit and overwrite
git checkout --orphan newBranch
git add -A
git commit -m "update site"
git branch -D master
git branch -m master
git gc --aggressive --prune=all
git push -f origin master

rem cleanup
popd
rmdir %dir% /s /q
