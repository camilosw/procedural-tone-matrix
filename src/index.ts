import Sequencer from './Sequencer';
import { CellCallback, setupEventListeners } from './setupEventListeners';
import 'styles/index.css';

const sequencer = new Sequencer();

const onClickCell: CellCallback = (row, col) => {
  console.log(row, col);
  sequencer.start();
};

setupEventListeners(onClickCell);
document
  .querySelector('.start-button')
  ?.addEventListener('click', () => sequencer.start());

document
  .querySelector('.stop-button')
  ?.addEventListener('click', () => sequencer.stop());
