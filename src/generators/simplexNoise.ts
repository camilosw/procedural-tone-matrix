import SimplexNoise from 'simplex-noise';

import { Generator } from './types';

const KEEP_LOOPS = 3;

export const simplexNoise: Generator = (notes: number, steps: number) => {
  const grid = Array(notes * steps).fill(0);
  const simplex = new SimplexNoise(new Date().getTime().toString());
  let t = 0;
  let keepLoop = 0;

  const getNoteStep = (
    time: number,
    step: number,
    minNote: number,
    maxNote: number,
  ) => {
    const value = (simplex.noise2D(time, step) + 1) / 1.8;
    const clampedValue = Math.min(Math.max(value, 0), 1);
    return Math.round(clampedValue * (maxNote - minNote) + minNote);
  };

  const stepNotes = (minNote: number, maxNote: number, offset: number) => {
    const values: number[] = [];
    const selectedIndexes: number[] = [];
    for (let i = 0; i < steps; i++) {
      const note = getNoteStep(t + offset * 1000, i, minNote, maxNote);
      values.push(note);
      selectedIndexes.push(i + note * steps);
    }

    return selectedIndexes;
  };

  const stepHoles = (offset: number) => {
    const holesValues: number[] = [];
    for (let i = 0; i < steps; i++) {
      holesValues.push(simplex.noise2D(t + offset * 1000, i * 10));
    }

    return holesValues.map(
      (value, index) =>
        value > (holesValues[index - 1] ?? holesValues[holesValues.length - 1]),
    );
  };

  const createNotes = (minNote: number, maxNote: number, offset: number) => {
    const selectedIndexes = stepNotes(minNote, maxNote, offset * 2);
    const holes = stepHoles(offset * 2 + 1);

    selectedIndexes.forEach((selectedIndex, index) => {
      if (holes[index]) {
        grid[selectedIndex] = 1;
      }
    });
  };

  const next = () => {
    t += 0.01;
    if (keepLoop > 0) {
      keepLoop--;
      return;
    }
    keepLoop = KEEP_LOOPS - 1;

    grid.forEach((_, index) => (grid[index] = 0));
    createNotes(0, notes / 2 - 1, 0);
    createNotes(notes / 2 - 1, notes - 1, 1);
  };

  return { grid, next };
};
