import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "/Users/rakmo33/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";
import { resolvePresentationFont } from "/Users/rakmo33/.codex/plugins/cache/openai-primary-runtime/presentations/26.904.11930/skills/presentations/container_tools/artifact_tool_utils.mjs";

const workspaceDir = "/Users/rakmo33/Documents/CEHDR/CEHDR_Website_Designs";
const skillDir = "/Users/rakmo33/.codex/plugins/cache/openai-primary-runtime/presentations/26.904.11930/skills/presentations";
const runtimePython = "/Users/rakmo33/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";
const finalPath = path.join(workspaceDir, "codex/output/presentations/emergency-preparedness-acknowledgement-and-thank-you-slides.pptx");
const bgPath = path.join(workspaceDir, "codex/output/images/emergency-event-navy-gold-background.png");
const partnerPath = path.join(workspaceDir, "codex/tmp/workspace-temporary/presentations/emergency-event/partner-strip.png");
const stagingDir = path.join(workspaceDir, "codex/tmp/emergency-event-closing-slides");
const candidatePath = path.join(stagingDir, "candidate.pptx");

const NAVY = "06234A";
const GOLD = "FDB515";
const WHITE = "FFFFFF";
const PALE = "DCE8F5";
const SLIDE_W = 1440;
const SLIDE_H = 810;

const fontFamily = await resolvePresentationFont();
const presentation = Presentation.create({ slideSize: { width: SLIDE_W, height: SLIDE_H } });
const bgBytes = await fs.readFile(bgPath);
const partnerBytes = await fs.readFile(partnerPath);

function addText(slide, text, left, top, width, height, opts = {}) {
  const box = slide.shapes.add({
    geometry: "textbox",
    position: { left, top, width, height },
    fill: "none",
    line: { fill: "none", width: 0 },
  });
  box.text = text;
  box.text.style = {
    typeface: opts.typeface || fontFamily,
    fontSize: opts.fontSize || 30,
    color: opts.color || WHITE,
    bold: opts.bold ?? false,
    italic: opts.italic ?? false,
    alignment: opts.alignment || "left",
    verticalAlignment: opts.verticalAlignment || "middle",
    autoFit: "none",
  };
  return box;
}

function addBackground(slide) {
  slide.images.add({
    blob: bgBytes,
    contentType: "image/png",
    position: { left: 0, top: 0, width: SLIDE_W, height: SLIDE_H },
    fit: "fill",
    alt: "Deep navy CEHDR event background with subtle leaves and a sweeping gold ribbon.",
  });
}

function addBrand(slide) {
  addText(slide, "UC Irvine", 78, 54, 260, 48, { fontSize: 31, bold: true });
  addText(slide, "CENTER FOR ENVIRONMENTAL\nHEALTH DISPARITIES RESEARCH", 80, 103, 390, 56, {
    fontSize: 15,
    color: PALE,
    bold: true,
  });
  slide.shapes.add({
    geometry: "rect",
    position: { left: 80, top: 172, width: 86, height: 6 },
    fill: GOLD,
    line: { fill: GOLD, width: 0 },
  });
}

// Slide 1: acknowledgements
{
  const slide = presentation.slides.add();
  addBackground(slide);
  addBrand(slide);
  addText(slide, "ACKNOWLEDGEMENTS", 78, 230, 760, 92, { fontSize: 57, color: GOLD, bold: true });
  addText(slide, "With gratitude to our partners and supporters", 80, 325, 820, 58, {
    fontSize: 30,
    bold: true,
  });
  addText(
    slide,
    "Thank you to the community members, caregivers, families, speakers, and partners who made this conversation possible.",
    80,
    397,
    805,
    100,
    { fontSize: 24, color: PALE },
  );
  slide.images.add({
    blob: partnerBytes,
    contentType: "image/png",
    position: { left: 80, top: 548, width: 1280, height: 94 },
    fit: "contain",
    alt: "Partner logos for CEHDR, Pacific Life, AAAE, UCI School of Pharmacy, and UCI Wen Public Health.",
  });
  addText(slide, "Stronger communities. Safer tomorrows.", 80, 688, 700, 44, {
    fontSize: 23,
    color: GOLD,
    bold: true,
  });
}

// Slide 2: thank you / closing
{
  const slide = presentation.slides.add();
  addBackground(slide);
  addBrand(slide);
  addText(slide, "THANK YOU", 80, 242, 790, 112, { fontSize: 75, color: GOLD, bold: true });
  addText(slide, "Questions and conversation", 82, 357, 800, 66, { fontSize: 37, bold: true });
  addText(
    slide,
    "Community Forum on Healthy Longevity,\nCaregiving, and Emergency Preparedness",
    82,
    439,
    760,
    105,
    { fontSize: 27, color: PALE },
  );
  slide.shapes.add({
    geometry: "rect",
    position: { left: 82, top: 583, width: 690, height: 2 },
    fill: GOLD,
    line: { fill: GOLD, width: 0 },
  });
  addText(slide, "cehdr@uci.edu   •   cehdr.publichealth.uci.edu", 82, 603, 760, 50, {
    fontSize: 22,
    bold: true,
  });
  addText(slide, "BE PREPARED.  BE INFORMED.  BE PROTECTED.", 82, 685, 880, 44, {
    fontSize: 22,
    color: GOLD,
    bold: true,
  });
}

await fs.mkdir(stagingDir, { recursive: true });
await fs.mkdir(path.dirname(finalPath), { recursive: true });
await (await PresentationFile.exportPptx(presentation)).save(candidatePath);

const { finalizePresentation } = await import(pathToFileURL(
  path.join(skillDir, "container_tools/artifact_tool_utils.mjs"),
).href);

await finalizePresentation({
  explicitTotalSlideCount: 2,
  workspaceDir,
  candidatePath,
  finalPath,
  pythonExecutable: runtimePython,
  integrityValidatorPath: path.join(skillDir, "container_tools/inspect_presentation_package_integrity.py"),
  layoutValidatorPath: path.join(skillDir, "container_tools/inspect_presentation_layout_geometry.py"),
  layoutArgs: [
    "--expected-slide-size-emu", "13716000,7715250",
    "--validate-heading-fit",
  ],
  requiredNativeTableOwnerSlides: [],
  requiredNativeChartOwnerSlides: [],
  fontPolicy: { basis: "design", families: [fontFamily] },
  verifyArtifactToolImport: true,
  receiptPath: path.join(stagingDir, "validation.json"),
});

console.log(JSON.stringify({ finalPath, fontFamily }, null, 2));
