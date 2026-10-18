import subprocess, json, pathlib
root=pathlib.Path(__file__).resolve().parent
base='https://moneybees.localhost:1355'
groups={'pms':['why','risk','performance'],'aif':['approach'],'our-approach':['philosophy','risk'],'performance':['pms','wealth','aif'],'case-studies':['timeline'],'careers':['openings','life','culture','apply'],'contact':['office'],'investor-centre':['logins','documents']}
def browser(*args):
    return subprocess.check_output(['agent-browser','--session','moneybee-content',*args],text=True)
for page, sections in groups.items():
    print(browser('open',base+'/'+page),flush=True)
    browser('wait','--load','load')
    browser('snapshot','-i')
    browser('wait','--fn','document.fonts.status === "loaded"')
    files=[]
    for section in sections:
        selector='#'+section
        height=int(browser('eval',f'Math.min(1800, document.querySelector({json.dumps(selector)}).offsetHeight + 100)').strip()) if section!='why' else 1000
        browser('set','viewport','1440',str(height))
        browser('eval',f'document.querySelector({json.dumps(selector)}).scrollIntoView({{behavior:"instant",block:"start"}})')
        browser('wait','--fn',f'Array.from(document.querySelector({json.dumps(selector)}).querySelectorAll("img")).every(i=>i.complete)')
        browser('wait','--fn',f'Array.from(document.querySelector({json.dumps(selector)}).querySelectorAll("h2")).every(e=>Number(getComputedStyle(e).opacity)>0.99)')
        filename=root/(page+'-'+section+'.png')
        if section=='why':
            # The PMS section spans several sticky panels. Capture its first readable panel.
            browser('eval','window.scrollBy({top:250,behavior:"instant"})')
            print(browser('screenshot',str(filename)),flush=True)
        else:
            print(browser('screenshot',str(filename)),flush=True)
        files.append(str(filename))
    out=root/(page+'.jpg')
    subprocess.run(['magick',*files,'-background','white','-gravity','center','-append','-quality','88',str(out)],check=True)
    print(out, out.stat().st_size,flush=True)
(root/'capture-manifest.json').write_text(json.dumps(groups,indent=2))
