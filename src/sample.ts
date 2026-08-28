import type { Frame } from './types';

const poses = [
  [[2, 7], [3, 6], [4, 5], [5, 5], [6, 6], [7, 6], [8, 5], [9, 4], [5, 7], [6, 8], [4, 9], [3, 10], [7, 8], [8, 9], [9, 9]],
  [[2, 7], [3, 6], [4, 5], [5, 5], [6, 6], [7, 6], [8, 6], [9, 6], [5, 7], [6, 8], [4, 9], [5, 9], [7, 8], [8, 8], [9, 7]],
  [[2, 6], [3, 6], [4, 5], [5, 5], [6, 6], [7, 7], [8, 7], [9, 8], [5, 7], [6, 8], [4, 9], [3, 9], [7, 8], [8, 9], [9, 10]],
  [[2, 6], [3, 6], [4, 5], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [5, 7], [6, 8], [4, 9], [3, 10], [7, 8], [8, 8], [9, 7]],
  [[2, 7], [3, 6], [4, 5], [5, 5], [6, 6], [7, 6], [8, 5], [9, 5], [5, 7], [6, 8], [4, 9], [5, 10], [7, 8], [8, 9], [9, 9]],
  [[2, 7], [3, 6], [4, 5], [5, 5], [6, 6], [7, 6], [8, 6], [9, 7], [5, 7], [6, 8], [4, 9], [3, 8], [7, 8], [8, 8], [9, 8]]
];

export function makeSampleFrames(): Frame[] {
  return poses.map((pose, index) => {
    const canvas = document.createElement('canvas');
    canvas.width = 192;
    canvas.height = 192;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas drawing is not available.');
    context.imageSmoothingEnabled = false;
    context.clearRect(0, 0, 192, 192);
    context.fillStyle = 'rgba(71, 98, 122, 0.3)';
    for (let x = 0; x < 192; x += 16) context.fillRect(x, 160, 8, 8);
    context.fillStyle = '#f5f3e8';
    for (const [x, y] of pose) context.fillRect(x * 16, y * 16, 16, 16);
    context.fillStyle = '#ffd166';
    context.fillRect(5 * 16, 4 * 16, 16, 16);
    context.fillStyle = '#090d12';
    context.fillRect(6 * 16, 5 * 16, 8, 8);
    return {
      name: `moth-run-${String(index + 1).padStart(2, '0')}.png`,
      dataUrl: canvas.toDataURL('image/png'),
      width: canvas.width,
      height: canvas.height
    };
  });
}
