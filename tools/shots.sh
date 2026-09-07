#!/bin/bash
# Usage: tools/shots.sh <url-or-file> <out-prefix>
#   -> <out-prefix>-desktop.png (1440x900), -desktop-full.png (1440x3200),
#      -mobile.png (true 390x844 via tools/mobile-frame.html), -mobile-full.png (390x3000)
# For a URL served by tools/audit.sh or python3 -m http.server, pass the full http://localhost:PORT/path/ URL.
# The frame is served on a second port from the project root so the site keeps its root-absolute URLs.
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SRC="$1"; OUTP="$2"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# Chrome is started in the background and polled, because headless Chrome sometimes never exits after writing the file.
shot(){ local out="$OUTP-$3.png"; rm -f "$out"; "$CHROME" --headless=new --disable-gpu --no-first-run --hide-scrollbars --user-data-dir="/tmp/cc-shots-$$-$3" --window-size="$2" --screenshot="$out" "$1" >/dev/null 2>&1 & local cp=$!; local i; for i in $(seq 1 30); do sleep 1; [ -s "$out" ] && break; done; sleep 1; kill $cp 2>/dev/null; rm -rf "/tmp/cc-shots-$$-$3"; echo "$out $(sips -g pixelWidth -g pixelHeight "$out" 2>/dev/null | grep -oE '[0-9]+$' | tr '\n' 'x')"; }
shot "$SRC" 1440,900 desktop
shot "$SRC" 1440,3200 desktop-full
FRAMEPORT=8799
python3 -m http.server $FRAMEPORT --directory "$ROOT" >/dev/null 2>&1 &
FP=$!
sleep 1
ENC=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "$SRC")
shot "http://localhost:$FRAMEPORT/tools/mobile-frame.html?src=$ENC" 500,900 mobile
shot "http://localhost:$FRAMEPORT/tools/mobile-frame.html?src=$ENC&h=3000" 500,3060 mobile-full
kill $FP 2>/dev/null
