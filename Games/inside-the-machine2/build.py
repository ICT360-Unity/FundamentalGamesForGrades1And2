"""Builds dist/inside-the-machine.html: one self-contained file with CSS, JS and audio embedded.
Run: python3 build.py"""
import re,base64,json,glob,os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
html=open('index.html').read()
css=open('css/styles.css').read()
font='data:font/woff2;base64,'+base64.b64encode(open('assets/fonts/Fredoka.woff2','rb').read()).decode()
css=css.replace('../assets/fonts/Fredoka.woff2',font)
html=html.replace('<link rel="stylesheet" href="css/styles.css">',f'<style>\n{css}</style>')
srcs=re.findall(r'<script src="(js/[^"]+)"></script>',html)
sfx={os.path.basename(f)[:-4]:'data:audio/mpeg;base64,'+base64.b64encode(open(f,'rb').read()).decode() for f in sorted(glob.glob('assets/audio/*.mp3'))}
js='window.SFX_DATA='+json.dumps(sfx)+';\n'+'\n'.join(open(s).read() for s in srcs)
block=re.search(r'<!--SCRIPTS-->.*<!--/SCRIPTS-->',html,re.S).group(0)
html=html.replace(block,'<script>\n(function(){\n'+js.replace('</script','<\\/script')+'\n})();\n</script>')
open('dist/inside-the-machine.html','w').write(html)
print('dist/inside-the-machine.html',round(len(html)/1024),'KB')
