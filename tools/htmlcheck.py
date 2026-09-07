#!/usr/bin/env python3
"""Static HTML checks: lang, single h1, heading order, img alt/size, links, em dashes, title/description lengths, schema presence."""
import re, sys, html, json
def check(path):
    t=open(path,encoding='utf-8').read()
    issues=[]
    m=re.search(r'<html[^>]*>', t); lang=re.search(r'lang="([^"]+)"', m.group(0)) if m else None
    if not lang: issues.append("html lang missing")
    title=re.search(r'<title>(.*?)</title>', t, re.S); tl=len(html.unescape(title.group(1).strip())) if title else 0
    if not title: issues.append("title missing")
    elif tl>60: issues.append(f"title {tl} chars (>60)")
    d=re.search(r'name="description" content="([^"]*)"', t); dl=len(d.group(1)) if d else 0
    if not d: issues.append("meta description missing")
    elif dl<120 or dl>160: issues.append(f"description {dl} chars (want 140-155)")
    for tag in ('canonical','og:image','og:title','og:description','twitter:card','application/ld+json','name="viewport"','theme-color'):
        if tag not in t: issues.append(f"missing {tag}")
    hs=[(int(x[0]), re.sub('<[^>]+>','',x[1]).strip()[:50]) for x in re.findall(r'<h([1-6])[^>]*>(.*?)</h\1>', t, re.S)]
    if sum(1 for h in hs if h[0]==1)!=1: issues.append(f"h1 count = {sum(1 for h in hs if h[0]==1)}")
    prev=0
    for lvl,txt in hs:
        if lvl>prev+1 and prev!=0: issues.append(f"heading skip h{prev} -> h{lvl} at '{txt}'")
        prev=lvl
    imgs=re.findall(r'<img[^>]*>', t)
    for i in imgs:
        if 'alt=' not in i: issues.append("img without alt: "+i[:80])
        if not re.search(r'\bwidth=', i) or not re.search(r'\bheight=', i): issues.append("img without width/height: "+i[:80])
    if '—' in t: issues.append(f"em dash present x{t.count('—')}")
    if 'skip' not in t.lower(): issues.append("no skip link found")
    if not re.search(r'<main\b', t): issues.append("no <main>")
    if not re.search(r'<button[^>]*aria-expanded', t): issues.append("no nav toggle button with aria-expanded")
    css=''
    import os
    for href in re.findall(r'<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"', t):
        if href.startswith('/'):
            for root in (os.path.dirname(path), os.path.join(os.path.dirname(path),'..'), os.path.join(os.path.dirname(path),'..','..')):
                f=os.path.join(root, href.lstrip('/'))
                if os.path.exists(f): css+=open(f).read(); break
    if 'prefers-reduced-motion' not in t and 'prefers-reduced-motion' not in css: issues.append("no reduced-motion handling")
    for s in re.findall(r'<script type="application/ld\+json">(.*?)</script>', t, re.S):
        try: json.loads(s)
        except Exception as e: issues.append(f"ld+json invalid: {e}")
    ext=re.findall(r'<script[^>]+src="(https?://[^"]+)"', t)
    if ext: issues.append("external scripts: "+", ".join(ext))
    fonts=re.findall(r'fonts\.googleapis\.com/css2\?[^"]+', t)
    fams=set(); 
    for f in fonts: fams.update(re.findall(r'family=([^:&]+)', f))
    if len(fams)>3: issues.append(f"{len(fams)} font families: {sorted(fams)}")
    size=len(t.encode())
    print(f"== {path}: {size//1024} KB html, {len(imgs)} imgs, headings={[(l,x[:22]) for l,x in hs][:14]}")
    for i in issues: print("   !", i)
    if not issues: print("   ok")
    return issues
if __name__=='__main__':
    bad=0
    for p in sys.argv[1:]: bad+=len(check(p))
    sys.exit(1 if bad else 0)
