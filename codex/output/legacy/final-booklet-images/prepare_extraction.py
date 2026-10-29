from PIL import Image, ImageFilter
from pathlib import Path
root=Path(__file__).parent
out=root/'high-resolution';out.mkdir(exist_ok=True)
for name in ['01-cover.png','02-welcome-program.png','03-speakers.png','04-contact.png']:
    im=Image.open(root/name).convert('RGB')
    im=im.resize((2048,3072),Image.Resampling.LANCZOS)
    im=im.filter(ImageFilter.UnsharpMask(radius=1.2,percent=90,threshold=4))
    im.save(out/name,dpi=(300,300),optimize=True)
    im.save(out/Path(name).with_suffix('.jpg'),quality=98,subsampling=0,dpi=(300,300))
    print(name,im.size)
