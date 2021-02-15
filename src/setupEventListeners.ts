export type CellCallback = (row: number, col: number) => unknown;

export const setupEventListeners = (callback: CellCallback) => {
  const cells = document.getElementsByClassName('cell');

  Array.from(cells).forEach((cell, index) =>
    cell.addEventListener('click', () =>
      callback(Math.floor(index / 16), index % 16),
    ),
  );
};
