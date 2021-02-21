/**
 * Randomly select one note and step per loop with the next constraints:
 * - Limit on the number of notes per column
 * - Limit on the total number of notes per loop
 * As soon as the total number of notes per loop has been reached, it
 * start to remove and add one note randomly
 */

import { Generator } from './types';

const NOTES_PER_COLUMN = 2;
const MAX_NOTES = 24;
const KEEP_LOOPS = 3;
const NOTES_PER_LOOP = 4;

export const constrainedRandom: Generator = (notes: number, steps: number) => {
  const grid = Array(notes * steps).fill(0);
  const gridIndex = grid.map((_, index) => index);
  const activeCellsIndex: number[] = [];
  const notesPerColumn = Array(steps).fill(0);
  let keepLoop = 0;

  const addNote = () => {
    const filteredGridIndex = gridIndex.filter(
      (index) => notesPerColumn[index % steps] < NOTES_PER_COLUMN,
    );
    const selected = Math.round(Math.random() * (filteredGridIndex.length - 1));
    const currentIndex = filteredGridIndex[selected];
    activeCellsIndex.push(currentIndex);
    gridIndex.splice(gridIndex.indexOf(selected), 1);
    grid[currentIndex] = 1;
    notesPerColumn[currentIndex % steps]++;
  };

  const removeNote = () => {
    const selected = Math.round(Math.random() * (activeCellsIndex.length - 1));
    const currentIndex = activeCellsIndex[selected];
    gridIndex.push(currentIndex);
    activeCellsIndex.splice(selected, 1);
    grid[currentIndex] = 0;
    notesPerColumn[currentIndex % steps]--;
  };

  const next = () => {
    if (keepLoop > 0) {
      keepLoop--;
      return;
    }

    if (activeCellsIndex.length >= MAX_NOTES) {
      for (let i = 0; i < NOTES_PER_LOOP; i++) {
        removeNote();
        addNote();
      }
      keepLoop = KEEP_LOOPS - 1;
    } else {
      addNote();
    }
  };

  return { grid, next };
};
