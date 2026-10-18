#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
rm -rf out-test
mkdir -p out-test
find src/main/java src/test/java -name '*.java' -print0 | xargs -0 javac -encoding UTF-8 -d out-test
java -cp out-test vn.edu.it6013.healthcare.WhiteBoxTestRunner
