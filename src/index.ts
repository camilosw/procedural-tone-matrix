import { highlightGrid, updateGrid } from 'grid';
import Sequencer from 'Sequencer';

import 'styles/index.css';

const NOTES = 16;
const STEPS = 16;
const grid = Array(NOTES * STEPS).fill(0);

const sequencer = new Sequencer();

sequencer.on('loop', () => {
  const noteIndex = Math.round(Math.random() * 15);
  const step = Math.round(Math.random() * 15);
  grid[noteIndex * 16 + step]++;
  grid[noteIndex * 16 + step] %= 2;
  sequencer.update(grid);
  updateGrid(grid);
});

sequencer.on('step', (step) => highlightGrid(grid, step, STEPS));

document
  .querySelector('.start-button')
  ?.addEventListener('click', () => sequencer.start());

document
  .querySelector('.stop-button')
  ?.addEventListener('click', () => sequencer.stop());
