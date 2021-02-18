import Sequencer from 'Sequencer';
import { updateGrid } from 'updateGrid';

import 'styles/index.css';

const sequencer = new Sequencer();

document
  .querySelector('.start-button')
  ?.addEventListener('click', () => sequencer.start());

document
  .querySelector('.stop-button')
  ?.addEventListener('click', () => sequencer.stop());

const grid = Array(16 * 16).fill(0);

sequencer.on('loop', () => {
  const noteIndex = Math.round(Math.random() * 15);
  const step = Math.round(Math.random() * 15);
  grid[noteIndex * 16 + step] = 1;
  sequencer.update(grid);
  updateGrid(grid);
});

sequencer.on('step', (step) => console.log('event', step));
