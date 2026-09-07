#!/usr/bin/env python3
"""dist/preview.html -> dist/frapp-capp-docket-site.html (artifact-friendly: no doctype/html/head/body wrapper)."""
import re, sys, os
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
t=open(f'{root}/dist/preview.html',encoding='utf-8').read()
head=re.search(r'<head>([\s\S]*?)</head>',t).group(1)
body=re.search(r'<body[^>]*>([\s\S]*)</body>',t).group(1)
bodycls=re.search(r'<body([^>]*)>',t).group(1)
head=re.sub(r'<meta charset[^>]*>|<meta name="viewport"[^>]*>','',head)
head=re.sub(r'<link[^>]+href="/css/pages/[^"]+"[^>]*>','',head)
head=re.sub(r'<title>.*?</title>','',head)
out='<title>Frapp &amp; Capp Docket Site</title>\n'+head+'\n<div'+bodycls+' id="site-root">'+body+'</div>\n<script>document.body.className=document.getElementById("site-root").className;</script>'
only=set(sys.argv[1].split(',')) if len(sys.argv)>1 and sys.argv[1] else None
if only:
    parts=re.split(r'(?=<div class="pv-page" data-page=")', out); keep=[parts[0]]
    for part in parts[1:]:
        slug=re.match(r'<div class="pv-page" data-page="([^"]+)"', part).group(1)
        if slug in only: keep.append(part)
        else:
            tail=re.search(r'\n(?=<footer|<script|</div>\n<script)', part)
            if tail: keep.append(part[tail.start():])
    out=''.join(keep)
if '--plain-json' in sys.argv: out=out.replace('type="application/json"','type="text/plain"')
open(f'{root}/dist/frapp-capp-docket-site.html','w').write(out)
print("wrote dist/frapp-capp-docket-site.html", len(out)//1024, "KB, pages:", out.count('class="pv-page"'))
