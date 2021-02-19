import { constrainedRandom } from 'generators/constrainedRandom';
// import { growShrinkRandom } from 'generators/growShrinkRandom';
// import { pureRandom } from 'generators/pureRandom';
import { highlightGrid, updateGrid } from 'grid';
import Sequencer from 'Sequencer';

import 'styles/index.css';

const NOTES = 16;
const STEPS = 16;

const sequencer = new Sequencer();
// const generator = pureRandom(NOTES, STEPS);
// const generator = growShrinkRandom(NOTES, STEPS);
const generator = constrainedRandom(NOTES, STEPS);

sequencer.on('loop', () => {
  generator.next();
  sequencer.update(generator.grid);
  updateGrid(generator.grid);
});

sequencer.on('step', (step) => highlightGrid(generator.grid, step, STEPS));

document
  .querySelector('.start-button')
  ?.addEventListener('click', () => sequencer.start());

document
  .querySelector('.stop-button')
  ?.addEventListener('click', () => sequencer.stop());
