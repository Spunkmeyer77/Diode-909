# renders the DIODE 909 panel (code/diode909_seq.js) to PNG with headless Chrome: a canvas stand-in
# for Max's mgraphics runs the real panel script. usage: render_panel.py <out.png> <setup js>
import subprocess, sys, os, json
here = os.path.dirname(os.path.abspath(__file__))
seq = open(os.path.join(here, '..', 'code', 'diode909_seq.js')).read()
out, setup = sys.argv[1], sys.argv[2]
W, H, S = 1160, 166, 2
html = """<html><body style="margin:0;background:#000"><canvas id=c width=%d height=%d style="width:%dpx;height:%dpx"></canvas><script>
var cv=document.getElementById('c'),g=cv.getContext('2d');g.scale(%d,%d);var face='Arial',size=10,path=false;
function fnt(){g.font=(face.indexOf('Bold')>=0?'bold ':'')+(face.indexOf('Italic')>=0?'italic ':'')+size+'px Arial';}
var mgraphics={init:function(){},redraw:function(){},set_source_rgba:function(r,gg,b,a){var c='rgba('+Math.round(r*255)+','+Math.round(gg*255)+','+Math.round(b*255)+','+a+')';g.fillStyle=c;g.strokeStyle=c;},
 rectangle:function(x,y,w,h){if(!path){g.beginPath();path=true;}g.rect(x,y,w,h);},ellipse:function(x,y,w,h){if(!path){g.beginPath();path=true;}g.moveTo(x+w,y+h/2);g.ellipse(x+w/2,y+h/2,Math.abs(w/2),Math.abs(h/2),0,0,2*Math.PI);},
 fill:function(){g.fill();path=false;},stroke:function(){g.stroke();path=false;},move_to:function(x,y){if(!path){g.beginPath();path=true;}g.moveTo(x,y);this._x=x;this._y=y;},line_to:function(x,y){g.lineTo(x,y);},
 set_line_width:function(w){g.lineWidth=w;},select_font_face:function(f){face=f;fnt();},set_font_size:function(s){size=s;fnt();},text_measure:function(t){fnt();return [g.measureText(t).width,size];},
 show_text:function(t){fnt();g.fillText(t,this._x,this._y);path=false;},
 save:function(){g.save();},restore:function(){g.restore();},translate:function(x,y){g.translate(x,y);},rotate:function(a){g.rotate(a);},scale:function(x,y){g.scale(x,y);},
 image_surface_draw:function(img,src,dst){img.flush();g.drawImage(img.cv,src[0],src[1],src[2],src[3],dst[0],dst[1],dst[2],dst[3]);}};
function Image(w,h){this.cv=document.createElement('canvas');this.cv.width=w;this.cv.height=h;this.ctx=this.cv.getContext('2d');this.data=this.ctx.createImageData(w,h);this.w=w;this.dirty=true;}
Image.prototype.setpixel=function(x,y,r,gg,b,a){var i=(y*this.w+x)*4,d=this.data.data;d[i]=r*255;d[i+1]=gg*255;d[i+2]=b*255;d[i+3]=a*255;this.dirty=true;};
Image.prototype.flush=function(){if(this.dirty){this.ctx.putImageData(this.data,0,0);this.dirty=false;}};
var box={rect:[0,0,%d,%d]};function outlet(){}function notifyclients(){}function post(){}function Task(f){this.schedule=function(){};}var OLDIMAGE=0;
var max={launchbrowser:function(){}};function arrayfromargs(a){return Array.prototype.slice.call(a);}var jsarguments=[];
%s
;%s
;paint();document.title='done';</script></body></html>""" % (W*S, H*S, W, H, S, S, W, H, seq, setup)
tmp = os.path.join(here, '_panel.html')
open(tmp, 'w').write(html)
subprocess.run(['google-chrome', '--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=%d' % S,
                '--window-size=%d,%d' % (W, H), '--screenshot=' + os.path.abspath(out), 'file://' + tmp], check=True, capture_output=True)
os.remove(tmp)
print('wrote', out)
