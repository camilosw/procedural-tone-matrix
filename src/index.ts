import { CellCallback, setupEventListeners } from 'setupEventListeners';
import 'styles/index.css';

const onClickCell: CellCallback = (row, col) => console.log(row, col);

setupEventListeners(onClickCell);
