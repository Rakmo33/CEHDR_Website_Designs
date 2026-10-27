import fs from 'node:fs/promises';
import path from 'node:path';
import {Presentation,PresentationFile} from '/Users/rakmo33/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';
import {finalizePresentation} from '/Users/rakmo33/.codex/plugins/cache/openai-primary-runtime/presentations/26.904.11930/skills/presentations/container_tools/artifact_tool_utils.mjs';
const root='/Users/rakmo33/Documents/CEHDR/CEHDR_Website_Designs';
const dir=path.join(root,'tmp/andrew-six');
const out=path.join(root,'output/presentations/andrew-six-screens.pptx');
const skill='/Users/rakmo33/.codex/plugins/cache/openai-primary-runtime/presentations/26.904.11930/skills/presentations';
await fs.mkdir(dir,{recursive:true});
await fs.mkdir(path.dirname(out),{recursive:true});
const p=Presentation.create({slideSize:{width:1920,height:1080}});
const navy='#06234A',gold='#FFD200',white='#FFFFFF';
function text(s,t,x,y,w,h,size=52,color=white,font='Arial',bold=false){
 const b=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 b.text=t;b.text.style={typeface:font,fontSize:size,color,bold,autoFit:'none',verticalAlignment:'middle'};return b;
}
function slide(title){const s=p.slides.add();s.background.fill=navy;text(s,title,95,75,1730,150,96,gold,'Impact');return s;}
const notes=[];
{
const s=p.slides.add();s.background.fill=navy;
text(s,'IF AN EMERGENCY\nHAPPENED TONIGHT...',95,175,1080,275,112,white,'Impact');
text(s,'WOULD YOUR HOUSEHOLD\nKNOW WHAT TO DO?',95,480,1120,225,99,gold,'Impact');
text(s,'Be prepared before you have to be',95,765,1050,65,50);
text(s,'Preparedness segment: Andrew Grundig\nLAFD CERT Call-Out Team Member\nFormer Battalion 6 Coordinator',95,885,1100,125,32);
notes.push('15 seconds. Visual area on the right: African American older adult and caregiver receiving an alert and reaching for the exact CEHDR backpack. Neutral narrator: If an emergency happened tonight, would your household know what to do? Would you know who to call, where to go, and what to take? A few steps today can help your family respond with confidence.');
}
{
const s=slide('MAKE A PLAN');
text(s,'Your household emergency plan',100,255,1100,75,56,white,'Arial',true);
const rows=['Emergency contacts and a meeting place','Evacuate or shelter in place','Local emergency alerts','A communication plan if phones fail'];
rows.forEach((t,i)=>text(s,t,100,365+i*135,1120,100,49));
text(s,'Talk it through together',100,950,1100,65,48,gold,'Impact');
notes.push('45 seconds. Blank right side for household planning image. Begin with a family emergency plan. Write down emergency contacts, including someone outside your local area. Choose a meeting location and make sure everyone knows how to reach it. Discuss evacuation and sheltering in place. Evacuation means leaving an unsafe area. Sheltering in place means staying inside when authorities tell you that is safer. Follow official instructions, and account for transportation, mobility, and caregiving needs. Sign up for local emergency alerts. Keep important phone numbers on paper. Agree on how you will reconnect if phones or internet service are unavailable. Review the plan together before an emergency happens.');
}
{
const s=slide('BUILD THE KIT');
text(s,'Everyday essentials',100,260,790,75,60,gold,'Impact');
text(s,'Water and nonperishable food\nFlashlight and radio\nBatteries or portable power\nFirst-aid supplies',100,365,850,330,51);
text(s,'Health and personal information',100,735,1010,75,60,gold,'Impact');
text(s,'Medications and identification\nImportant documents\nSpecial-needs and comfort supplies',100,835,1020,185,49);
notes.push('90 seconds. Right half stays blank for the exact CEHDR backpack. Animate separate item images beside it in Canva. Your preparedness kit should bring the essentials together in one accessible place. Start with water and nonperishable food that your household can use. Consider dietary needs, and include a manual can opener when needed. Add a flashlight so you can move safely if the power goes out. A battery-powered radio can help you hear official updates when other services fail. Pack spare batteries that fit your equipment, or portable power for the devices you depend on. Include first-aid supplies. Make room for medications and the information needed to use them correctly. Add personal identification, emergency contacts, and copies of important documents. Keep these protected from water. Think about the supplies that are specific to your household, such as mobility, hearing, vision, or other medical needs. Include familiar comfort items. As you gather each item, ask: Who will use it? Can they use it easily? Is anything missing? The kit should support the people in your home, rather than simply repeat a generic checklist. Keep your plan and key information with the kit so you can take them together when you need to leave.');
}
{
const s=slide('PERSONALIZE IT');
text(s,'Prepare for your household’s needs',100,255,1100,80,58,white,'Arial',true);
text(s,'Medication list and medication supply\nCaregiver and emergency contacts\nCopies of identification\nMobility, hearing, vision and medical supplies\nFamiliar comfort items\nInformation for a person living with dementia',100,385,1170,490,48);
text(s,'What helps this person feel safe?',100,935,1170,70,52,gold,'Impact');
notes.push('60 seconds. Right side blank for African American older adult and caregiver. Every household has different needs. Keep a current medication list, and plan with a pharmacist or care team for several days of medication when possible. Include caregiver and emergency contacts, and copies of identification. Consider mobility aids, hearing-aid batteries, glasses, and other medical supplies the person relies on. For someone living with dementia, unfamiliar places and disrupted routines can be upsetting. Add familiar comfort items and simple information about their routines, communication preferences, and care needs. Include the name and phone number of a caregiver who can help. Think about what keeps the person calm, how they communicate discomfort, and what support they need to move safely. Review these details with the person and their care team where possible. Personalizing the kit now can make an emergency less confusing for everyone.');
}
{
const s=slide('STORE AND MAINTAIN IT');
text(s,'Easy to reach. Known to everyone.',100,260,1180,95,60,white,'Arial',true);
text(s,'Keep the kit accessible\nTell everyone where it is\nReview it every six months\nReplace expired supplies',100,410,1080,385,58);
text(s,'Food, water, batteries and medications',100,865,1170,90,47,gold);
notes.push('30 seconds. Right side blank for kit near an exit. Store your kit where you can reach it quickly, and make sure everyone in the household knows where it is. Review it every six months, and whenever health or caregiving needs change. Check expiration dates and replace supplies as needed. Follow storage instructions for food, water, batteries, and medications. Update contact details and medication lists. A kit only helps when its contents are ready to use.');
}
{
const s=p.slides.add();s.background.fill=navy;
text(s,'BE PREPARED\nBEFORE YOU HAVE TO BE',100,110,1710,240,116,gold,'Impact');
text(s,'Make your plan.\nBuild your kit.\nCheck it regularly.',105,425,1190,285,82,white,'Impact');
text(s,'CEHDR',105,810,900,100,86,white,'Arial',true);
text(s,'Center for Environmental Health Disparities Research\nUC Irvine',105,925,1430,100,40);
notes.push('20 seconds. Warm closing visual may be added on the right. Do not wait for an evacuation order to discover what your household needs. Make your plan. Build your kit. Check it regularly. Start with one action today, and keep going together. Be prepared before you have to be.');
}
p.slides.items.forEach((s,i)=>s.speakerNotes.textFrame.setText(notes[i]+'\nSource: Andrews Segment.pdf and user-approved six-screen structure. Images intentionally left open for user insertion.'));
const candidate=path.join(dir,'candidate.pptx');
await(await PresentationFile.exportPptx(p)).save(candidate);
await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:out,pythonExecutable:'/Users/rakmo33/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3',integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','18288000,10287000','--validate-heading-fit'],explicitTotalSlideCount:6,requiredNativeChartOwnerSlides:[],requiredNativeTableOwnerSlides:[],fontPolicy:{basis:'design',families:['Impact','Arial']},verifyArtifactToolImport:true,receiptPath:path.join(dir,'validation.json')});
for(let i=0;i<p.slides.items.length;i++){const b=await p.export({slide:p.slides.items[i],format:'png',scale:0.6});await fs.writeFile(path.join(dir,`slide-${i+1}.png`),new Uint8Array(await b.arrayBuffer()));}
await fs.writeFile(path.join(root,'output/presentations/andrew-voiceover-script.txt'),notes.map((n,i)=>`SLIDE ${i+1}\n${n}`).join('\n\n'));
console.log(out);
