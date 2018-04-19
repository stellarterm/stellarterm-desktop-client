# Usage: ./fetchTravisBuild.sh stellarterm-build-output/stellarterm/stellarterm/24/24.1/dist/index.html 3baf63b28afa7f95f34fe16f650b4e6454273c24090b2f0e94553ae7e001fbea
aws s3 cp s3://$1 .  --region us-east-1
HASH=$(openssl dgst -sha256 index.html | sed 's/^.* //')

if [ "$2" = "$HASH" ]
then
  echo "Hashes are equal. Sha256: ${HASH}"
else
  echo "Hashes are NOT EQUAL!!! Removing index.html"
  rm index.html
fi
