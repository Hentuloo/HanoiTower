import { Hanoi } from './types';
import { getBestPossibleTrace } from './utils/hanoiUtils';

const hanoi: Hanoi = [[ 1,2], [], []];
const endHanoi: Hanoi = [[], [], [ 1,2]];

console.log(getBestPossibleTrace(hanoi, endHanoi));
// 2 => 3
// 3 => 7
//  L(n)=2^{n}-1
