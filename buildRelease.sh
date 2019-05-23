# Builds the release notes

ST_VERSION=$(egrep -o 'window.stBuildInfo={version:[0-9]+' index.html | egrep -o '[0-9]+')
ST_VVERSION=v${ST_VERSION}
# echo $ST_VERSION

printf "StellarTerm Desktop Client v$ST_VERSION\n\n" > github-release-notes.txt

printf '```\n' >> github-release-notes.txt
npm run -s hash >> github-release-notes.txt
printf '```\n' >> github-release-notes.txt

cat github-release-notes.txt

hub release create -d -F github-release-notes.txt -a release-builds/stellarterm-osx.zip -a release-builds/stellarterm-win32-x64.zip -a release-builds/stellarterm-linux-x64.zip $ST_VVERSION
