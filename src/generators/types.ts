export type Generator = (
  notes: number,
  steps: number,
) => {
  grid: number[];
  next: () => void;
};
