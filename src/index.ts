import { constrainedRandom } from 'generators/constrainedRandom';
import { growShrinkRandom } from 'generators/growShrinkRandom';
import { pureRandom } from 'generators/pureRandom';
import { simplexNoise } from 'generators/simplexNoise';
import { highlightGrid, updateGrid } from 'grid';
import Sequencer from 'Sequencer';

import 'styles/index.css';

const NOTES = 16;
const STEPS = 16;

const generators = {
  'simplex-noise': simplexNoise,
  'constrained-random': constrainedRandom,
  'grow-shrink-random': growShrinkRandom,
  'pure-random': pureRandom,
};

let generator = generators['simplex-noise'](NOTES, STEPS);

const sequencer = new Sequencer();
sequencer.on('loop', () => {
  generator.next();
  sequencer.update(generator.grid);
  updateGrid(generator.grid);
});
sequencer.on('step', (step) => highlightGrid(generator.grid, step, STEPS));

document
  .querySelector('#generator')
  ?.addEventListener('change', ({ target }: Event) => {
    const value = (target as HTMLSelectElement)
      .value as keyof typeof generators;
    generator = generators[value](NOTES, STEPS);
  });

const startStopButton = document.querySelector('.start-button');

startStopButton?.addEventListener('click', () => {
  if (sequencer.getState() === 'started') {
    sequencer.stop();
    startStopButton.textContent = 'Start';
  } else {
    sequencer.start();
    startStopButton.textContent = 'Stop';
  }
});
