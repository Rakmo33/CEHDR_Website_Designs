from pathlib import Path
from PIL import Image, ImageDraw
import numpy as np

root=Path('/Users/rakmo33/Documents/CEHDR/CEHDR_Website_Designs/output')
out=root/'booklet-source-portraits';out.mkdir(exist_ok=True)
pdf=Image.open(root/'booklet-source-audit/p3-X4.jpg').convert('RGB')
jpg=Image.open('/Users/rakmo33/Downloads/Program Booklet 2nd annual brain health awareness/3.jpg').convert('RGB')
sources={
 'karen':pdf.crop((25,66,131,165)),
 'tia':pdf.crop((25,176,131,278)),
 'andrew':pdf.crop((25,288,131,394)),
 'kacie':jpg.crop((31,484,210,681)),
}
for name,im in sources.items():im.save(out/f'{name}-unaltered-source-crop.png')
page=Image.open(root/'imagegen/emergency-preparedness-booklet-redesign/final-revisions/03-speakers-host-label-relocated.png').convert('RGB')
a=np.array(page)
# Only clear pale blue/white background pixels outside the photographic circles.
yy,xx=np.indices(a.shape[:2]);safe=(yy<1250)
circles=[('karen',170,280,124),('tia',831,524,126),('kacie',179,792,126),('andrew',832,1081,128)]
for _,cx,cy,r in circles:safe &= ((xx-cx)**2+(yy-cy)**2 > (r+5)**2)
light=(a[:,:,0]>145)&(a[:,:,1]>160)&(a[:,:,2]>175)
a[safe & light]=255
page=Image.fromarray(a);draw=ImageDraw.Draw(page)
for name,cx,cy,r in circles:
 im=sources[name];w,h=im.size;s=min(w,h)
 # Crop only; resizing is conventional interpolation, with no AI or retouching.
 left=(w-s)//2;top=0 if name=='kacie' else (h-s)//2
 im=im.crop((left,top,left+s,top+s)).resize((r*2,r*2),Image.Resampling.LANCZOS)
 mask=Image.new('L',(r*2,r*2));ImageDraw.Draw(mask).ellipse((0,0,r*2-1,r*2-1),fill=255)
 draw.ellipse((cx-r-4,cy-r-4,cx+r+4,cy+r+4),fill='#f5bd16')
 page.paste(im,(cx-r,cy-r),mask)
page.save(out/'03-speakers-original-portraits-white-background.png')
