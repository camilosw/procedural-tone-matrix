/** Only for debug purposes */

const canvasStyle: Partial<CSSStyleDeclaration> = {
  position: 'fixed',
  top: '0',
};
const canvasStyleString = Object.entries(canvasStyle)
  .map(([key, value]) => `${key}:${value};`)
  .join('')
  .replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

const canvas = document.createElement('canvas');
canvas.setAttribute('style', canvasStyleString);
canvas.setAttribute('width', '300px');
canvas.setAttribute('height', '600px');

const body = document.querySelector('body');
body?.appendChild(canvas);

const ctx = canvas.getContext('2d');

type GraphOptions = { offset?: number; scale?: number };
export const drawGraph = (
  values: number[],
  { offset = 0, scale = 3 }: GraphOptions = {},
) => {
  const height = 50;
  if (ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, offset * height, 300, height);

    ctx.strokeStyle = '#fff';
    ctx.moveTo(0, values[0] * scale + offset * height);
    ctx.beginPath();
    values.forEach((value, index) =>
      ctx.lineTo(index * 10, value * scale + offset * height),
    );
    ctx.stroke();
  }
};
