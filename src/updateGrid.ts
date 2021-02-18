const cells = Array.from(document.getElementsByClassName('cell'));

export const updateGrid = (grid: number[]) => {
  grid.forEach((element, index) => {
    const cell = cells[index];
    element ? cell.classList.add('active') : cell.classList.remove('active');
  });
};
