#!/usr/bin/env python3
"""Generate 1200x630 Open Graph images in the Docket design system via headless Chrome."""
import os, subprocess, html, sys
from PIL import Image
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PAGES={
 "home":   {"l1":"Great coffee.","l2":"Real careers.","l3":"Same docket.","lines":[("1 FLAT WHITE","4.90"),("1 BARISTA TRAINING","incl."),("1 AWARD WAGES","incl."),("1 REAL CAREER","incl.")],"total":("TOTAL","4.90"),"foot":"and something bigger","photo":"photo-barista.webp"},
 "menu":   {"l1":"Small menu.","l2":"Big craft.","l3":"","lines":[("1 CAPPUCCINO","4.90"),("1 ICED FRAPPE","5.90"),("1 TOASTIE OF THE DAY","ask"),("ALT MILK","+0.80")],"total":("SIZES","S 4.90 / L 5.90"),"foot":"decaf available","photo":"photo-latte.webp"},
 "visit":  {"l1":"First coffee's","l2":"a good excuse.","l3":"","lines":[("1 WEST TERRACE","BANKSTOWN"),("MON TO FRI","9:30am to 3pm"),("SAT AND SUN","closed"),("STEP-FREE ENTRY","yes")],"total":("SEE YOU","SOON"),"foot":"1 West Terrace, Bankstown NSW 2200","photo":"photo-team.webp"},
 "shop-beans":{"l1":"The House","l2":"Blend.","l3":"Take it home.","lines":[("100% ARABICA","yes"),("ROAST","medium-dark"),("NOTES","strawberry"),("BAG","250g compostable")],"total":("ROASTED","IN-HOUSE"),"foot":"bagged by our team","photo":"photo-latte.webp"},
 "our-story":{"l1":"Coffee was","l2":"never really","l3":"the point.","lines":[("OPENED","May 2023"),("RUN BY","TLC Disability Services"),("WAGES","award, always"),("PATHWAY","train, then employ")],"total":("REAL JOBS","SINCE 2023"),"foot":"a social enterprise cafe","photo":"photo-team.webp"},
 "careers": {"l1":"Your first real","l2":"job could start","l3":"with a shift here.","lines":[("1 BARISTA TRAINING","full course"),("1 AWARD WAGE ROLE","on the roster"),("1 SUPPORT TEAM","on and off shift")],"total":("APPLY","ANY DAY"),"foot":"people with disability welcome","photo":"photo-barista.webp"},
 "spin-win":{"l1":"Spin","l2":"& Win.","l3":"","lines":[("1 SPIN","free"),("1 PRIZE","maybe"),("SIGN-UP","none")],"total":("SHOW THE","BARISTA"),"foot":"no app needed","photo":"photo-barista.webp"},
}
TPL="""<!doctype html><html lang="en-AU"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Nunito:wght@400;700;800&family=IBM+Plex+Mono:wght@400;600&display=swap">
<style>
*{box-sizing:border-box;margin:0}html,body{width:1200px;height:630px;overflow:hidden}
body{background:#F6F1E7;font-family:Nunito,sans-serif;color:#10284A;position:relative}
.grain{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(16,40,74,.025) 0 1px,transparent 1px 3px)}
.left{position:absolute;left:64px;top:64px;width:520px}
.eyebrow{font-family:'IBM Plex Mono',monospace;font-weight:600;font-size:18px;letter-spacing:.14em;color:#A8470B;margin-bottom:22px}
h1{font-family:Fredoka,sans-serif;font-weight:700;font-size:62px;line-height:1.04;letter-spacing:-.01em}
h1 .o{color:#EA7424}
.brand{position:absolute;left:64px;bottom:56px;display:flex;align-items:center;gap:14px;font-family:Fredoka,sans-serif;font-weight:700;font-size:28px}
.brand img{height:44px;width:auto}.brand span{color:#EA7424}
.brand small{font-family:'IBM Plex Mono',monospace;font-weight:400;font-size:16px;color:#5B6478;margin-left:8px;letter-spacing:.06em}
.photo{position:absolute;right:0;top:0;width:470px;height:630px;object-fit:cover;object-position:top}
.docket{position:absolute;right:230px;top:110px;width:340px;background:#FFFDF8;color:#10284A;padding:26px 26px 30px;font-family:'IBM Plex Mono',monospace;font-size:15px;transform:rotate(-3deg);box-shadow:0 18px 40px rgba(16,40,74,.25);
 -webkit-mask:radial-gradient(circle at 10px 0,transparent 6px,#000 6.5px) -10px 0/20px 100% repeat-x; }
.docket:before{content:"";display:block;height:8px}
.dh{text-align:center;font-weight:600;letter-spacing:.1em;font-size:14px}.dh img{height:34px;display:block;margin:0 auto 8px}
.dsub{text-align:center;font-size:12px;color:#5B6478;margin-top:2px}
.rule{border-top:1.5px dashed #10284A;margin:14px 0}
.line{display:flex;justify-content:space-between;gap:8px;padding:5px 0;font-size:15px}
.line b{font-weight:600}.line .v{color:#A8470B;font-weight:600;white-space:nowrap}
.tot{display:flex;justify-content:space-between;font-weight:600;font-size:17px;padding-top:6px}
.foot{text-align:center;font-size:12px;color:#5B6478;margin-top:10px}
.stamp{position:absolute;right:40px;top:44px;transform:rotate(6deg);background:#EA7424;color:#10284A;font-family:'IBM Plex Mono',monospace;font-weight:600;font-size:15px;letter-spacing:.12em;padding:8px 14px;border:2px solid #10284A;box-shadow:3px 3px 0 #10284A}
</style></head><body><div class="grain"></div>
<img class="photo" src="file://{root}/assets/{photo}" alt="">
<div class="left"><div class="eyebrow">SPECIALTY COFFEE, BANKSTOWN NSW</div><h1>{l1}<br>{l2}{l3}</h1></div>
<div class="docket"><div class="dh"><img src="file://{root}/assets/logo-mark.png" alt="">FRAPP &amp; CAPP</div><div class="dsub">1 West Terrace, Bankstown 2200</div><div class="rule"></div>{lines}<div class="rule"></div><div class="tot"><span>{t0}</span><span>{t1}</span></div><div class="foot">{foot}</div></div>
<div class="stamp">{stamp}</div>
<div class="brand"><img src="file://{root}/assets/logo-mark.png" alt="">Frapp <span>&amp;</span> Capp <small>frappandcapp.com</small></div>
</body></html>"""
os.makedirs(f"{ROOT}/og/tmp", exist_ok=True)
for slug,p in PAGES.items():
    lines="".join(f'<div class="line"><b>{html.escape(a)}</b><span class="v">{html.escape(b)}</span></div>' for a,b in p["lines"])
    l3=f'<br><span class="o">{html.escape(p["l3"])}</span>' if p["l3"] else ""
    doc=TPL.replace("{root}",ROOT).replace("{photo}",p["photo"]).replace("{l1}",html.escape(p["l1"])).replace("{l2}",html.escape(p["l2"])).replace("{l3}",l3).replace("{lines}",lines).replace("{t0}",html.escape(p["total"][0])).replace("{t1}",html.escape(p["total"][1])).replace("{foot}",html.escape(p["foot"])).replace("{stamp}","OPEN WEEKDAYS" if slug!="spin-win" else "SHOW THE BARISTA")
    hp=f"{ROOT}/og/tmp/{slug}.html"; open(hp,"w").write(doc)
    png=f"{ROOT}/og/tmp/{slug}.png"
    if os.path.exists(png): os.remove(png)
    proc=subprocess.Popen([CHROME,"--headless=new","--disable-gpu","--hide-scrollbars","--allow-file-access-from-files","--no-first-run",f"--user-data-dir={ROOT}/og/tmp/.chrome-{slug}","--window-size=1200,630",f"--screenshot={png}",f"file://{hp}"],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    import time
    for _ in range(300):
        if os.path.exists(png) and os.path.getsize(png)>1000: time.sleep(0.5); break
        if proc.poll() is not None: break
        time.sleep(0.1)
    proc.kill(); proc.wait()
    if not os.path.exists(png): print(slug, "FAILED: no screenshot"); continue
    im=Image.open(png).convert("RGB"); out=f"{ROOT}/assets/og-{slug}.jpg"; im.save(out,"JPEG",quality=84,optimize=True,progressive=True)
    print(slug, im.size, os.path.getsize(out)//1024, "KB")
subprocess.run(["rm","-rf"]+[f"{ROOT}/og/tmp/.chrome-{s}" for s in PAGES])
