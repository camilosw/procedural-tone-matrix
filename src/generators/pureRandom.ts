/**
 * Randomly select one note and step per loop. If is not active,
 * turn it on, otherwise, turn it off
 */

export const pureRandom = (notes: number, steps: number) => {
  const grid = Array(notes * steps).fill(0);

  const next = () => {
    const noteIndex = Math.round(Math.random() * (notes - 1));
    const step = Math.round(Math.random() * (steps - 1));
    grid[noteIndex * steps + step]++;
    grid[noteIndex * steps + step] %= 2;
  };

  return { grid, next };
};
