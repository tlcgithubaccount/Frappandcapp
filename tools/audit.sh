#!/bin/bash
# Usage: tools/audit.sh <root-dir-to-serve> <out-dir> <url-path> [<url-path>...]
# Serves root on :8765, runs Lighthouse mobile + desktop for each path, saves JSON + summary.
set -u
ROOT="$1"; OUT="$2"; shift 2
mkdir -p "$OUT"
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
python3 -m http.server 8765 --directory "$ROOT" >/dev/null 2>&1 &
SRV=$!
sleep 1
for path in "$@"; do
  slug=$(echo "$path" | sed 's#[^A-Za-z0-9]#_#g')
  for mode in mobile desktop; do
    if [ "$mode" = desktop ]; then preset="--preset=desktop"; else preset=""; fi
    npx --yes lighthouse@12 "http://localhost:8765$path" --quiet $preset \
      --chrome-flags="--headless=new --no-sandbox --user-data-dir=$OUT/.chrome-$slug-$mode" \
      --output=json --output-path="$OUT/lh-$slug-$mode.json" \
      --only-categories=performance,accessibility,best-practices,seo >/dev/null 2>&1
    echo "$path [$mode] -> $OUT/lh-$slug-$mode.json ($( [ -s "$OUT/lh-$slug-$mode.json" ] && echo ok || echo FAILED ))"
  done
done
kill $SRV 2>/dev/null
rm -rf "$OUT"/.chrome-*
python3 - "$OUT" <<'PY'
import json, glob, os, sys
out=sys.argv[1]
rows=[]
for f in sorted(glob.glob(f"{out}/lh-*.json")):
    d=json.load(open(f)); a=d['audits']; c=d['categories']
    fails=[k for k,v in a.items() if v.get('score') is not None and v['score']<0.9 and v.get('scoreDisplayMode') not in ('notApplicable','manual','informative')]
    rows.append((os.path.basename(f), *(round((c[k]['score'] or 0)*100) for k in ('performance','accessibility','best-practices','seo')),
      a['largest-contentful-paint']['displayValue'], a['cumulative-layout-shift']['displayValue'], a['total-byte-weight']['displayValue'], fails))
print(f"{'file':38} perf a11y bp seo  LCP      CLS    weight")
for r in rows:
    print(f"{r[0]:38} {r[1]:4} {r[2]:4} {r[3]:3} {r[4]:3}  {r[5]:8} {r[6]:6} {r[7]}")
    for k in r[8]: print("     -", k)
PY
