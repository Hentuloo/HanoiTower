import { Hanoi } from './types';
import { getBestPossibleTrace } from './utils/hanoiUtils';

const hanoi: Hanoi = [[ 1,2,3], [], []];
const endHanoi: Hanoi = [[], [], [ 1,2,3]];
const result = getBestPossibleTrace(hanoi, endHanoi);
console.log(`Number of steps: ${result?.length})`); // restul length should be equale L(n)=2^{n}-1 ('n' is number of elements)
console.log(`Best moves:`)
console.log(result)
