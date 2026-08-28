import { decompressFrames, parseGIF } from 'gifuct-js';
import type { Frame } from './types';

function canvasDataUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png');
}

export function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('The browser could not draw one frame.'));
    image.src = dataUrl;
  });
}

async function decodePng(file: File): Promise<Frame[]> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) throw new Error('Canvas drawing is not available.');
  context.imageSmoothingEnabled = false;
  context.drawImage(bitmap, 0, 0);
  bitmap.close();
  return [{ name: file.name, dataUrl: canvasDataUrl(canvas), width: canvas.width, height: canvas.height }];
}

async function decodeGif(file: File): Promise<Frame[]> {
  const parsed = parseGIF(await file.arrayBuffer());
  const decoded = decompressFrames(parsed, true);
  if (!decoded.length) throw new Error(`${file.name} has no readable GIF frames.`);

  const width = parsed.lsd.width;
  const height = parsed.lsd.height;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) throw new Error('Canvas drawing is not available.');
  context.imageSmoothingEnabled = false;
  const frames: Frame[] = [];
  let restore: ImageData | undefined;
  let previousDisposal = 0;
  let previousDims: { left: number; top: number; width: number; height: number } | undefined;

  for (let index = 0; index < decoded.length; index += 1) {
    const frame = decoded[index];
    if (previousDisposal === 2 && previousDims) {
      context.clearRect(previousDims.left, previousDims.top, previousDims.width, previousDims.height);
    } else if (previousDisposal === 3 && restore) {
      context.putImageData(restore, 0, 0);
    }
    restore = context.getImageData(0, 0, width, height);
    const patch = new ImageData(new Uint8ClampedArray(frame.patch), frame.dims.width, frame.dims.height);
    const patchCanvas = document.createElement('canvas');
    patchCanvas.width = frame.dims.width;
    patchCanvas.height = frame.dims.height;
    patchCanvas.getContext('2d')?.putImageData(patch, 0, 0);
    context.drawImage(patchCanvas, frame.dims.left, frame.dims.top);
    frames.push({
      name: `${file.name.replace(/\.gif$/i, '')}-${String(index + 1).padStart(2, '0')}.png`,
      dataUrl: canvasDataUrl(canvas),
      width,
      height
    });
    previousDisposal = frame.disposalType;
    previousDims = frame.dims;
  }
  return frames;
}

export async function decodeFiles(fileList: FileList | File[]): Promise<Frame[]> {
  const files = Array.from(fileList).sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
  );
  if (!files.length) throw new Error('No files were selected. Choose numbered PNG or GIF files.');
  const invalid = files.find((file) => !/\.(png|gif)$/i.test(file.name));
  if (invalid) throw new Error(`${invalid.name} is not a PNG or GIF. Choose numbered PNG or GIF files.`);
  const groups: Frame[][] = [];
  for (const file of files) {
    groups.push(/\.gif$/i.test(file.name) ? await decodeGif(file) : await decodePng(file));
  }
  return groups.flat();
}
