import type { Frame, LayerSettings, SavedProject, ViewerSettings } from './types';
import { clearProject, loadProject, saveProject } from './storage';
import { decodeFiles, loadImage } from './images';
import { makeSampleFrames } from './sample';

const defaults: ViewerSettings = {
  previous: { visible: true, opacity: 0.28, tint: '#55e6df', tinted: true },
  current: { visible: true, opacity: 1, tint: '#f5f3e8', tinted: false },
  next: { visible: true, opacity: 0.28, tint: '#ff6fae', tinted: true }
};

type Route = '/' | '/demo' | '/privacy' | '/terms' | '/404';

const titles: Record<Route, string> = {
  '/': 'Onion Next Frame — Compare animation frames',
  '/demo': 'Demo — Onion Next Frame',
  '/privacy': 'Privacy — Onion Next Frame',
  '/terms': 'Terms — Onion Next Frame',
  '/404': 'Missing frame — Onion Next Frame'
};

const descriptions: Record<Route, string> = {
  '/': 'Compare each pixel drawing with its previous and next animation frame. Import locally, adjust onion layers, and export a contact sheet.',
  '/demo': 'Try a six-frame pixel animation in a private, unsaved demo.',
  '/privacy': 'How Onion Next Frame handles files and local browser storage.',
  '/terms': 'The plain terms for using Onion Next Frame.',
  '/404': 'This frame does not exist.'
};

let cleanupTool: (() => void) | undefined;

function routeFromPath(path: string): Route {
  if (path === '/' || path === '/demo' || path === '/privacy' || path === '/terms') return path;
  return '/404';
}

function shell(content: string, demo = false): string {
  return `
    <a class="skip-link" href="#main">Skip to main content</a>
    ${demo ? `<aside class="demo-banner" aria-label="Demo status"><span><strong>Demo</strong> — sample data, nothing is saved</span><div><button class="text-button" id="reset-demo" type="button">Reset demo</button><a href="/" data-nav>Start for real</a></div></aside>` : ''}
    <header class="site-header">
      <a class="wordmark" href="/" data-nav aria-label="Onion Next Frame home"><span aria-hidden="true" class="mark"><i></i><i></i><i></i></span><span>Onion<br>Next Frame</span></a>
      <nav aria-label="Main navigation">
        <a href="/" data-nav>Home</a>
        <a href="/demo" data-nav>Demo</a>
        <a href="/privacy" data-nav>Privacy</a>
      </nav>
      <span class="offline-indicator" id="network-state" role="status">Ready offline</span>
    </header>
    <main id="main">${content}</main>
    <footer class="site-footer">
      <p><span class="footer-mark" aria-hidden="true">◫ ◧ ◫</span> A local light table for animation frames.</p>
      <nav aria-label="Footer navigation"><a href="/privacy" data-nav>Privacy</a><a href="/terms" data-nav>Terms</a><a href="https://sociobot.in" rel="external">Built by Param Factory <span class="sr-only">(external site)</span>↗</a></nav>
      <p>v1.0.0 · Generated artwork disclosed in the design notes.</p>
    </footer>
    <div class="route-announcer sr-only" aria-live="polite"></div>
    <div class="toast" id="update-toast" hidden><span>An updated frame is ready.</span><button type="button" id="apply-update">Load update</button></div>
  `;
}

function homePage(): string {
  return shell(`
    <section class="hero section-grid" aria-labelledby="page-title">
      <div class="section-number" aria-hidden="true">00—01</div>
      <div class="hero-copy">
        <p class="eyebrow">A light table for frame sequences</p>
        <h1 id="page-title" tabindex="-1">Compare the frames before and after</h1>
        <p class="lede">For pixel artists checking motion between drawings without changing their main editor.</p>
        <div class="hero-actions">
          <a class="key key-primary" href="/demo" data-nav>Try it with sample data</a>
          <span>Loads a 6-frame run cycle.</span>
        </div>
        <button class="import-link" type="button" data-open-import>Import your frames</button>
        <ul class="fact-list" aria-label="Product facts">
          <li><span aria-hidden="true">◇</span> Free to use</li>
          <li><span aria-hidden="true">◇</span> Works offline after the first visit</li>
          <li><span aria-hidden="true">◇</span> Images stay on this device</li>
        </ul>
      </div>
      <figure class="hero-art">
        <picture>
          <source media="(max-width: 700px)" srcset="/assets/hero-640.webp" />
          <img src="/assets/hero-1200.webp" width="1200" height="800" alt="Three pixel creature poses show the previous, current, and next animation frames." fetchpriority="high" decoding="async" />
        </picture>
        <figcaption><span>PREVIOUS</span><span>CURRENT</span><span>NEXT</span></figcaption>
      </figure>
    </section>
    ${toolSection(false)}
    ${howItWorks()}
    ${operatorNote()}
  `);
}

function demoPage(): string {
  return shell(`
    <section class="demo-intro section-grid">
      <div class="section-number" aria-hidden="true">DE—MO</div>
      <div>
        <p class="eyebrow">Six sample drawings are loaded</p>
        <h1 id="page-title" tabindex="-1">Compare the frames before and after</h1>
        <p class="lede">Move through the run cycle. Change each layer, then export its contact sheet.</p>
      </div>
    </section>
    ${toolSection(true)}
    ${howItWorks()}
    ${operatorNote()}
  `, true);
}

function layerControl(key: keyof ViewerSettings, label: string, shortcut: string): string {
  const setting = defaults[key];
  return `<fieldset class="layer-control" data-layer="${key}">
    <legend><span class="layer-dot layer-dot-${key}" aria-hidden="true"></span>${label}<kbd>${shortcut}</kbd></legend>
    <label class="switch"><input type="checkbox" data-field="visible" ${setting.visible ? 'checked' : ''} /><span>Show layer</span></label>
    <label><span>Opacity <output data-output="opacity">${Math.round(setting.opacity * 100)}%</output></span><input type="range" min="0" max="100" value="${setting.opacity * 100}" data-field="opacity" /></label>
    <div class="tint-row"><label><span>Tint</span><input type="color" value="${setting.tint}" data-field="tint" /></label><label class="switch"><input type="checkbox" data-field="tinted" ${setting.tinted ? 'checked' : ''} /><span>Use tint</span></label></div>
  </fieldset>`;
}

function toolSection(demo: boolean): string {
  return `<section class="light-table-section" id="light-table" aria-labelledby="tool-heading">
    <div class="tool-heading section-grid">
      <div class="section-number" aria-hidden="true">01—06</div>
      <div><p class="eyebrow">Live onion preview</p><h2 id="tool-heading">Check the in-between drawing</h2><p>Import numbered PNG files or one animated GIF. File names set the frame order.</p></div>
    </div>
    <div class="workbench ${demo ? 'is-demo' : ''}">
      <div class="viewport-column">
        <div class="drop-zone" id="drop-zone">
          <canvas id="onion-canvas" width="720" height="520" role="img" aria-label="No frames loaded"></canvas>
          <div class="empty-state" id="empty-state">
            <span class="empty-frame" aria-hidden="true">＋</span>
            <strong>Your onion preview appears here.</strong>
            <span>Choose numbered PNG files or an animated GIF.</span>
            <button class="key key-primary" type="button" data-open-import>Import your frames</button>
          </div>
          <div class="drop-cue" aria-hidden="true">Drop PNG or GIF files</div>
        </div>
        <input class="sr-only" id="file-input" type="file" accept="image/png,image/gif,.png,.gif" multiple tabindex="-1" aria-label="Import PNG or GIF frames" />
        <input class="sr-only" id="project-input" type="file" accept="application/json,.json" tabindex="-1" aria-label="Import Onion Next Frame project" />
        <div class="transport" aria-label="Frame controls">
          <button class="square-key" id="previous-frame" type="button" aria-label="Show previous frame">←</button>
          <div class="counter"><span id="current-counter">FRAME — / —</span><span id="project-name">No sequence loaded</span></div>
          <button class="square-key" id="next-frame" type="button" aria-label="Show next frame">→</button>
        </div>
        <input id="frame-slider" class="frame-slider" type="range" min="0" max="0" value="0" aria-label="Current frame" disabled />
        <div class="frame-strip" id="frame-strip" role="group" aria-label="Sequence frames"></div>
        <p class="viewer-status" id="viewer-status" role="status">Import frames or load the sample to start.</p>
      </div>
      <aside class="console" aria-label="Onion layer settings">
        <div class="console-top"><span>LAYERS</span><span>RGB / ALPHA</span></div>
        ${layerControl('previous', 'Previous frame', '←')}
        ${layerControl('current', 'Current frame', '•')}
        ${layerControl('next', 'Next frame', '→')}
        <div class="console-actions">
          <button class="key key-secondary" type="button" data-open-import>Import frames</button>
          <button class="key key-primary" id="export-sheet" type="button" disabled>Export contact sheet <kbd>E</kbd></button>
          <div class="project-actions"><button class="text-button" id="import-project" type="button">Import project</button><button class="text-button" id="export-project" type="button" disabled>Export project</button></div>
          <button class="text-button danger-link" id="clear-project" type="button" disabled>Clear sequence</button>
        </div>
        <p class="keyboard-note">Keyboard: ← → changes frames. Shift jumps to an end.</p>
      </aside>
    </div>
  </section>`;
}

function howItWorks(): string {
  return `<section class="how-section section-grid" aria-labelledby="how-heading">
    <div class="section-number" aria-hidden="true">02—04</div>
    <div><p class="eyebrow">Three keys</p><h2 id="how-heading">From files to a useful reference</h2>
      <ol class="frame-steps">
        <li><span>01</span><div><h3>Import the sequence</h3><p>Select numbered PNG files or one animated GIF.</p></div></li>
        <li><span>02</span><div><h3>Tune each neighbour</h3><p>Set visibility, opacity, and tint for all three layers.</p></div></li>
        <li><span>03</span><div><h3>Export the sheet</h3><p>Download one PNG with every source frame in order.</p></div></li>
      </ol>
    </div>
  </section>`;
}

function operatorNote(): string {
  return `<section class="note-section section-grid" aria-labelledby="note-heading">
    <div class="section-number" aria-hidden="true">LOCAL</div>
    <div class="operator-note"><p class="eyebrow">Operator note</p><h2 id="note-heading">This is a reviewer, not an editor</h2><p>It does not paint, interpolate, host, or sync artwork. It keeps the review surface small.</p><p>Your browser decodes the images. The app stores your latest real sequence in this browser. Demo frames use memory only.</p><a href="/privacy" data-nav>Read the privacy details</a></div>
  </section>`;
}

function privacyPage(): string {
  return shell(`<article class="legal-page"><p class="eyebrow">Privacy</p><h1 id="page-title" tabindex="-1">Your drawings stay in your browser</h1><p class="lede">Onion Next Frame has no account, server upload, analytics, or advertising.</p><h2>Files you import</h2><p>Your browser decodes PNG and GIF files on this device. The app stores the latest real sequence in IndexedDB so it can survive a reload.</p><h2>Demo data</h2><p>The demo builds six sample frames in memory. It does not read or write your saved sequence.</p><h2>Network use</h2><p>The service worker downloads and caches the app files. The app sends no artwork or usage data anywhere.</p><h2>Remove local data</h2><p>Choose “Clear sequence” in the light table. You can also clear this site's storage in your browser settings.</p><p>Last updated: 28 August 2026.</p></article>`);
}

function termsPage(): string {
  return shell(`<article class="legal-page"><p class="eyebrow">Terms</p><h1 id="page-title" tabindex="-1">Use the tool on artwork you control</h1><p class="lede">Onion Next Frame is a free reference tool. It is not a painting editor or recovery service.</p><h2>Your responsibility</h2><p>Only open artwork that you have permission to use. Keep a separate copy of every source file.</p><h2>No warranty</h2><p>The software is provided “as is” under the MIT License. Browser support and GIF decoding can vary.</p><h2>Acceptable use</h2><p>Do not use the site to break laws or interfere with the service.</p><h2>Changes</h2><p>These terms may change with a new product version. The date below records this version.</p><p>Last updated: 28 August 2026.</p></article>`);
}

function missingPage(): string {
  return shell(`<section class="missing-page"><p class="eyebrow">FRAME — —</p><div class="missing-slot"><h1 id="page-title" tabindex="-1">This frame is missing</h1><p>The address does not point to a page.</p><a class="key key-primary" href="/" data-nav>Return to the light table</a></div></section>`);
}

function copySettings(settings: ViewerSettings = defaults): ViewerSettings {
  return structuredClone(settings);
}

async function initializeTool(demo: boolean): Promise<() => void> {
  const controller = new AbortController();
  const { signal } = controller;
  const canvas = document.querySelector<HTMLCanvasElement>('#onion-canvas')!;
  const context = canvas.getContext('2d')!;

  let frames: Frame[] = [];
  let current = 0;
  let projectName = '';
  let settings = copySettings();
  let drawVersion = 0;
  let saveTimer: number | undefined;
  const imageCache = new Map<string, Promise<HTMLImageElement>>();
  const empty = document.querySelector<HTMLElement>('#empty-state')!;
  const counter = document.querySelector<HTMLElement>('#current-counter')!;
  const projectLabel = document.querySelector<HTMLElement>('#project-name')!;
  const status = document.querySelector<HTMLElement>('#viewer-status')!;
  const slider = document.querySelector<HTMLInputElement>('#frame-slider')!;
  const strip = document.querySelector<HTMLElement>('#frame-strip')!;
  const previousButton = document.querySelector<HTMLButtonElement>('#previous-frame')!;
  const nextButton = document.querySelector<HTMLButtonElement>('#next-frame')!;
  const exportButton = document.querySelector<HTMLButtonElement>('#export-sheet')!;
  const clearButton = document.querySelector<HTMLButtonElement>('#clear-project')!;
  const fileInput = document.querySelector<HTMLInputElement>('#file-input')!;
  const projectInput = document.querySelector<HTMLInputElement>('#project-input')!;
  const importProjectButton = document.querySelector<HTMLButtonElement>('#import-project')!;
  const exportProjectButton = document.querySelector<HTMLButtonElement>('#export-project')!;
  const dropZone = document.querySelector<HTMLElement>('#drop-zone')!;

  function announce(message: string): void {
    status.textContent = message;
  }

  function cachedImage(frame: Frame): Promise<HTMLImageElement> {
    let result = imageCache.get(frame.dataUrl);
    if (!result) {
      result = loadImage(frame.dataUrl);
      imageCache.set(frame.dataUrl, result);
    }
    return result;
  }

  function scheduleSave(): void {
    if (demo || !frames.length) return;
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      const project: SavedProject = { id: 'latest', name: projectName, savedAt: Date.now(), current, frames, settings };
      saveProject(project).catch(() => announce('The preview works, but this browser could not save the sequence.'));
    }, 180);
  }

  function paintGrid(): void {
    context.fillStyle = '#0b1118';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#101a24';
    for (let y = 0; y < canvas.height; y += 32) {
      for (let x = 0; x < canvas.width; x += 32) {
        if ((x / 32 + y / 32) % 2 === 0) context.fillRect(x, y, 32, 32);
      }
    }
    context.strokeStyle = '#263a4c';
    context.lineWidth = 2;
    context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
  }

  async function drawLayer(frame: Frame, layer: LayerSettings): Promise<void> {
    if (!layer.visible || layer.opacity === 0) return;
    const image = await cachedImage(frame);
    const scale = Math.min((canvas.width - 72) / frame.width, (canvas.height - 72) / frame.height);
    const width = Math.max(1, Math.floor(frame.width * scale));
    const height = Math.max(1, Math.floor(frame.height * scale));
    const left = Math.floor((canvas.width - width) / 2);
    const top = Math.floor((canvas.height - height) / 2);
    context.save();
    context.globalAlpha = layer.opacity;
    context.imageSmoothingEnabled = false;
    if (layer.tinted) {
      const buffer = document.createElement('canvas');
      buffer.width = canvas.width;
      buffer.height = canvas.height;
      const bufferContext = buffer.getContext('2d')!;
      bufferContext.imageSmoothingEnabled = false;
      bufferContext.drawImage(image, left, top, width, height);
      bufferContext.globalCompositeOperation = 'source-in';
      bufferContext.fillStyle = layer.tint;
      bufferContext.fillRect(0, 0, buffer.width, buffer.height);
      context.drawImage(buffer, 0, 0);
    } else {
      context.drawImage(image, left, top, width, height);
    }
    context.restore();
  }

  async function draw(): Promise<void> {
    const version = ++drawVersion;
    paintGrid();
    if (!frames.length) return;
    const before = frames[current - 1];
    const active = frames[current];
    const after = frames[current + 1];
    try {
      if (before) await drawLayer(before, settings.previous);
      if (active) await drawLayer(active, settings.current);
      if (after) await drawLayer(after, settings.next);
      if (version !== drawVersion) return;
      const parts = [`Showing frame ${current + 1}`];
      if (before) parts.push(`previous ${current}`);
      if (after) parts.push(`next ${current + 2}`);
      canvas.setAttribute('aria-label', `${parts.join(', ')}. Previous, current, and next drawings are layered on one canvas.`);
    } catch {
      announce('One frame could not be drawn. Import the source sequence again.');
    }
  }

  function updateStrip(): void {
    strip.replaceChildren();
    frames.forEach((frame, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = index === current ? 'is-current' : '';
      button.setAttribute('aria-label', `Show frame ${index + 1}: ${frame.name}`);
      button.setAttribute('aria-current', index === current ? 'true' : 'false');
      button.textContent = String(index + 1).padStart(2, '0');
      button.addEventListener('click', () => setCurrent(index), { signal });
      strip.append(button);
    });
  }

  function updateUi(message?: string): void {
    const hasFrames = frames.length > 0;
    empty.hidden = hasFrames;
    slider.disabled = !hasFrames;
    slider.max = String(Math.max(0, frames.length - 1));
    slider.value = String(current);
    previousButton.disabled = !hasFrames || current === 0;
    nextButton.disabled = !hasFrames || current === frames.length - 1;
    exportButton.disabled = !hasFrames;
    exportProjectButton.disabled = !hasFrames;
    clearButton.disabled = !hasFrames;
    counter.textContent = hasFrames ? `FRAME ${String(current + 1).padStart(2, '0')} / ${String(frames.length).padStart(2, '0')}` : 'FRAME — / —';
    projectLabel.textContent = hasFrames ? projectName : 'No sequence loaded';
    if (message) announce(message);
    updateStrip();
    void draw();
  }

  function setCurrent(index: number, message = true): void {
    if (!frames.length) return;
    current = Math.max(0, Math.min(frames.length - 1, index));
    updateUi(message ? `Showing frame ${current + 1} of ${frames.length}.` : undefined);
    scheduleSave();
  }

  function syncControlInputs(): void {
    document.querySelectorAll<HTMLElement>('[data-layer]').forEach((group) => {
      const key = group.dataset.layer as keyof ViewerSettings;
      group.querySelector<HTMLInputElement>('[data-field="visible"]')!.checked = settings[key].visible;
      group.querySelector<HTMLInputElement>('[data-field="opacity"]')!.value = String(settings[key].opacity * 100);
      group.querySelector<HTMLOutputElement>('[data-output="opacity"]')!.value = `${Math.round(settings[key].opacity * 100)}%`;
      group.querySelector<HTMLInputElement>('[data-field="tint"]')!.value = settings[key].tint;
      group.querySelector<HTMLInputElement>('[data-field="tinted"]')!.checked = settings[key].tinted;
    });
  }

  async function importFiles(files: FileList | File[]): Promise<void> {
    announce('Reading frames in this browser…');
    try {
      const decoded = await decodeFiles(files);
      frames = decoded;
      imageCache.clear();
      current = Math.min(1, frames.length - 1);
      projectName = frames.length === 1 ? decoded[0].name : `${decoded[0].name} + ${frames.length - 1}`;
      settings = copySettings();
      syncControlInputs();
      updateUi(`Loaded ${frames.length} frame${frames.length === 1 ? '' : 's'}.`);
      scheduleSave();
    } catch (error) {
      announce(error instanceof Error ? error.message : 'The files could not be read. Choose PNG or GIF files.');
    } finally {
      fileInput.value = '';
    }
  }

  async function exportSheet(): Promise<void> {
    if (!frames.length) return;
    announce('Building the contact sheet…');
    const columns = Math.min(4, frames.length);
    const cellWidth = 220;
    const cellHeight = 252;
    const sheet = document.createElement('canvas');
    sheet.width = columns * cellWidth;
    sheet.height = Math.ceil(frames.length / columns) * cellHeight + 56;
    const sheetContext = sheet.getContext('2d');
    if (!sheetContext) return;
    sheetContext.fillStyle = '#090d12';
    sheetContext.fillRect(0, 0, sheet.width, sheet.height);
    sheetContext.fillStyle = '#f5f3e8';
    sheetContext.font = '700 20px sans-serif';
    sheetContext.fillText('ONION NEXT FRAME / CONTACT SHEET', 20, 34);
    sheetContext.font = '14px monospace';
    for (let index = 0; index < frames.length; index += 1) {
      const frame = frames[index];
      const image = await cachedImage(frame);
      const column = index % columns;
      const row = Math.floor(index / columns);
      const left = column * cellWidth + 12;
      const top = row * cellHeight + 56;
      sheetContext.fillStyle = index === current ? '#ffd166' : '#263a4c';
      sheetContext.fillRect(left, top, 196, 196);
      sheetContext.fillStyle = '#101820';
      sheetContext.fillRect(left + 2, top + 2, 192, 192);
      const scale = Math.min(176 / frame.width, 176 / frame.height);
      const width = Math.floor(frame.width * scale);
      const height = Math.floor(frame.height * scale);
      sheetContext.imageSmoothingEnabled = false;
      sheetContext.drawImage(image, left + 10 + (176 - width) / 2, top + 10 + (176 - height) / 2, width, height);
      sheetContext.fillStyle = index === current ? '#ffd166' : '#f5f3e8';
      sheetContext.fillText(`${String(index + 1).padStart(2, '0')}  ${frame.name.slice(0, 21)}`, left, top + 218);
    }
    sheet.toBlob((blob) => {
      if (!blob) {
        announce('The contact sheet could not be made. Try the export again.');
        return;
      }
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = 'onion-next-frame-contact-sheet.png';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      announce(`Exported a contact sheet with ${frames.length} frames.`);
    }, 'image/png');
  }

  function exportProject(): void {
    if (!frames.length) return;
    const project: SavedProject = { id: 'latest', name: projectName, savedAt: Date.now(), current, frames, settings };
    const blob = new Blob([JSON.stringify({ format: 'onion-next-frame', version: 1, project })], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'onion-next-frame-project.json';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce(`Exported a project file with ${frames.length} frames.`);
  }

  async function importProject(file: File): Promise<void> {
    try {
      const parsed = JSON.parse(await file.text()) as { format?: string; version?: number; project?: SavedProject };
      const imported = parsed.project;
      if (parsed.format !== 'onion-next-frame' || parsed.version !== 1 || !imported || !Array.isArray(imported.frames) || !imported.frames.length) {
        throw new Error('This is not an Onion Next Frame project. Choose an exported project JSON file.');
      }
      if (imported.frames.some((frame) => !frame.dataUrl?.startsWith('data:image/png') || !frame.width || !frame.height)) {
        throw new Error('The project has an unreadable frame. Export it again from Onion Next Frame.');
      }
      frames = imported.frames;
      imageCache.clear();
      current = Math.max(0, Math.min(imported.current ?? 0, frames.length - 1));
      projectName = imported.name || file.name;
      settings = imported.settings ? copySettings(imported.settings) : copySettings();
      syncControlInputs();
      updateUi(`Imported a project with ${frames.length} frames.`);
      scheduleSave();
    } catch (error) {
      announce(error instanceof SyntaxError ? 'The project file is not valid JSON. Choose an exported project file.' : error instanceof Error ? error.message : 'The project could not be imported.');
    } finally {
      projectInput.value = '';
    }
  }

  document.querySelectorAll<HTMLButtonElement>('[data-open-import]').forEach((button) => {
    button.addEventListener('click', () => fileInput.click(), { signal });
  });
  fileInput.addEventListener('change', () => fileInput.files && void importFiles(fileInput.files), { signal });
  previousButton.addEventListener('click', () => setCurrent(current - 1), { signal });
  nextButton.addEventListener('click', () => setCurrent(current + 1), { signal });
  slider.addEventListener('input', () => setCurrent(Number(slider.value)), { signal });
  exportButton.addEventListener('click', () => void exportSheet(), { signal });
  exportProjectButton.addEventListener('click', exportProject, { signal });
  importProjectButton.addEventListener('click', () => projectInput.click(), { signal });
  projectInput.addEventListener('change', () => projectInput.files?.[0] && void importProject(projectInput.files[0]), { signal });
  clearButton.addEventListener('click', async () => {
    if (!window.confirm(`Clear ${frames.length} frames from this browser?`)) return;
    frames = [];
    imageCache.clear();
    current = 0;
    projectName = '';
    if (!demo) await clearProject();
    updateUi('The sequence was cleared. Import frames to start again.');
  }, { signal });

  document.querySelectorAll<HTMLElement>('[data-layer]').forEach((group) => {
    const key = group.dataset.layer as keyof ViewerSettings;
    group.querySelectorAll<HTMLInputElement>('[data-field]').forEach((input) => {
      input.addEventListener('input', () => {
        const field = input.dataset.field as keyof LayerSettings;
        if (field === 'opacity') {
          settings[key].opacity = Number(input.value) / 100;
          group.querySelector<HTMLOutputElement>('[data-output="opacity"]')!.value = `${input.value}%`;
        } else if (field === 'tint') {
          settings[key].tint = input.value;
        } else {
          settings[key][field] = input.checked as never;
        }
        void draw();
        scheduleSave();
      }, { signal });
    });
  });

  for (const type of ['dragenter', 'dragover']) {
    dropZone.addEventListener(type, (event) => {
      event.preventDefault();
      dropZone.classList.add('is-dragging');
    }, { signal });
  }
  for (const type of ['dragleave', 'drop']) {
    dropZone.addEventListener(type, (event) => {
      event.preventDefault();
      dropZone.classList.remove('is-dragging');
    }, { signal });
  }
  dropZone.addEventListener('drop', (event) => {
    const dragEvent = event as DragEvent;
    if (dragEvent.dataTransfer?.files.length) void importFiles(dragEvent.dataTransfer.files);
  }, { signal });

  window.addEventListener('keydown', (event) => {
    const target = event.target as HTMLElement;
    if (target.matches('input, button, a, select, textarea')) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setCurrent(event.shiftKey ? 0 : current - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      setCurrent(event.shiftKey ? frames.length - 1 : current + 1);
    } else if (event.key.toLowerCase() === 'e') {
      event.preventDefault();
      void exportSheet();
    }
  }, { signal });

  if (demo) {
    frames = makeSampleFrames();
    current = 2;
    projectName = 'Moth run cycle — sample';
    updateUi('Loaded 6 sample frames. Nothing is saved.');
    document.querySelector('#reset-demo')?.addEventListener('click', () => {
      frames = makeSampleFrames();
      settings = copySettings();
      current = 2;
      projectName = 'Moth run cycle — sample';
      syncControlInputs();
      updateUi('Demo reset to 6 sample frames.');
    }, { signal });
  } else {
    updateUi();
    try {
      const saved = await loadProject();
      if (saved?.frames.length) {
        frames = saved.frames;
        settings = saved.settings;
        current = Math.min(saved.current, frames.length - 1);
        projectName = saved.name;
        syncControlInputs();
        updateUi(`Restored ${frames.length} saved frames from this browser.`);
      }
    } catch {
      announce('Saved frames could not be opened. You can import the sequence again.');
    }
  }

  return () => {
    controller.abort();
    window.clearTimeout(saveTimer);
  };
}

function bindNavigation(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[data-nav]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      history.pushState({}, '', link.pathname);
      void render(true);
    });
  });
}

function updateNetworkState(): void {
  const element = document.querySelector<HTMLElement>('#network-state');
  if (!element) return;
  element.textContent = navigator.onLine ? 'Ready offline' : 'Offline mode';
  element.classList.toggle('is-offline', !navigator.onLine);
}

export async function render(moveFocus = false): Promise<void> {
  cleanupTool?.();
  cleanupTool = undefined;
  const route = routeFromPath(location.pathname.replace(/\/$/, '') || '/');
  const root = document.querySelector<HTMLDivElement>('#app')!;
  document.title = titles[route];
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', descriptions[route]);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', `https://onion-next-frame.sociobot.in${route === '/404' ? location.pathname : route}`);
  if (route === '/') root.innerHTML = homePage();
  else if (route === '/demo') root.innerHTML = demoPage();
  else if (route === '/privacy') root.innerHTML = privacyPage();
  else if (route === '/terms') root.innerHTML = termsPage();
  else root.innerHTML = missingPage();
  bindNavigation();
  updateNetworkState();
  if (route === '/' || route === '/demo') cleanupTool = await initializeTool(route === '/demo');
  const heading = document.querySelector<HTMLElement>('h1');
  document.querySelector<HTMLElement>('.route-announcer')!.textContent = heading?.textContent ?? '';
  if (moveFocus) {
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    heading?.focus({ preventScroll: true });
  }
}

window.addEventListener('popstate', () => void render(true));
window.addEventListener('online', updateNetworkState);
window.addEventListener('offline', updateNetworkState);

export function showUpdate(registration: ServiceWorkerRegistration): void {
  const toast = document.querySelector<HTMLElement>('#update-toast');
  if (!toast) return;
  toast.hidden = false;
  document.querySelector('#apply-update')?.addEventListener('click', () => {
    navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), { once: true });
    registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
  }, { once: true });
}
