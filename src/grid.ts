const cells = Array.from(document.getElementsByClassName('cell'));

export const updateGrid = (grid: number[]) => {
  grid.forEach((element, index) => {
    const cell = cells[index];
    element ? cell.classList.add('active') : cell.classList.remove('active');
  });
};

export const highlightGrid = (grid: number[], step: number, steps: number) => {
  const highlightedCells: Element[] = [];

  for (let i = 0; i < steps; i++) {
    const cellIndex = step + i * steps;
    if (grid[cellIndex]) {
      cells[cellIndex].classList.add('highlighted');
      highlightedCells.push(cells[cellIndex]);
    }
  }

  setTimeout(
    () =>
      highlightedCells.forEach((cell) => cell.classList.remove('highlighted')),
    125,
  );
};
