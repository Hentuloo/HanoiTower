import { Hanoi, HanoiTower } from "../types";
import { addAsFirst, getFirst, isItemValidToMove, removeFirst } from "./hanoiTowerUtils";

type prevStateMapKey = string;
type prevStateMapValue = number;
type prevStateMap = Map<prevStateMapKey, prevStateMapValue>;

const getArrayAsString = JSON.stringify;
const createPrevStateMap = (): prevStateMap => new Map();
const addMoveToPrevStateMap = (prevState: prevStateMap, move: Hanoi, counter: number) => prevState.set(getArrayAsString(move), counter);
const addMovesToPrevStateMap = (prevState: prevStateMap, moves: Hanoi[], counter: number) => moves.reduce((acc, move) => addMoveToPrevStateMap(acc, move, counter), prevState);
const createPrevStateMapWithStartMoves = (moves: Hanoi[]): prevStateMap => addMovesToPrevStateMap(createPrevStateMap(), moves, 0);

export const getArrayOfLength = (length: number): Array<number> => new Array(length).fill(null).map((u, i) => i);
export const mapTowers = (hanoi: Hanoi, callback: (HanoiTower: HanoiTower, number: number) => HanoiTower) => hanoi.map(callback);
export const compareHanoi = (currentHanoi: Hanoi, endHanoi: Hanoi): boolean => getArrayAsString(currentHanoi) === getArrayAsString(endHanoi); // TODO: better array compare
export const getHanoiTowerByIndex = (hanoi: Hanoi, index: number): HanoiTower => hanoi[index];
export const getHanoiInPrevStates = (prevStatesMap: prevStateMap, hanoiState: Hanoi): number | undefined => prevStatesMap.get(getArrayAsString(hanoiState));
export const handleIsValidToMove = (hanoi: Hanoi, from: number, to: number) => from !== to && isItemValidToMove(hanoi[from], hanoi[to]);
export const moveItem = (hanoi: Hanoi, from: number, to: number): Hanoi => {
    const fromTower = getHanoiTowerByIndex(hanoi, from);
    const fromTowerFirstItem = getFirst(fromTower);

    const [firstTower, secondTower, thirdTower] = hanoi.map((el: HanoiTower, index: number) => {
        if (from === index) return removeFirst(el)
        if (to === index && fromTowerFirstItem) return addAsFirst(el, fromTowerFirstItem);
        return el;
    })
    return [firstTower, secondTower, thirdTower];
}
export const moveItemIfValid = (hanoi: Hanoi, from: number, to: number) => {
    return handleIsValidToMove(hanoi, from, to) ? moveItem(hanoi, from, to) : null;
}
export const getValidAndUniqueMove = (hanoi: Hanoi, from: number, to: number, prevStates: prevStateMap, counter: number) => {
    const move = moveItemIfValid(hanoi, from, to)

    if (!move) return null;
    const hanoiTraceCountFromPrevStates = getHanoiInPrevStates(prevStates, move);
    if (hanoiTraceCountFromPrevStates !== undefined && hanoiTraceCountFromPrevStates < counter) return null;

    return move;
}
export const addPossibleMoveForTowerIndex = (hanoi: Hanoi, prevStates: prevStateMap, moves: Hanoi[], towerIndex: number, possibleTowerIndex: number, counter: number): Hanoi[] => {
    const move = getValidAndUniqueMove(hanoi, towerIndex, possibleTowerIndex, prevStates, counter);
    return move ? [...moves, move] : moves;
};
export const addPossibleMovesForTowerIndex = (hanoi: Hanoi, prevStates: prevStateMap, moves: Hanoi[], tower: HanoiTower, towerIndex: number, counter: number) => {
    const arrayOfHanoiLenght = getArrayOfLength(hanoi.length);
    return arrayOfHanoiLenght.reduce((acc_, _, possibleTowerIndex) => addPossibleMoveForTowerIndex(hanoi, prevStates, acc_, towerIndex, possibleTowerIndex, counter), moves)
};
export const getPossibleMoves = (hanoi: Hanoi, prevStates: prevStateMap, counter: number): Hanoi[] =>
    hanoi.reduce((acc: Hanoi[], tower: HanoiTower, towerIndex: number) => addPossibleMovesForTowerIndex(hanoi, prevStates, acc, tower, towerIndex, counter), [])
export const addElementToTrace = (trace: Hanoi[], move: Hanoi) => [...trace,move];
export const addPossibleTraceForHanoiState = (endHanoi: Hanoi, traces: Hanoi[][], trace: Hanoi[], possibleMove: Hanoi, prevStates: prevStateMap): Hanoi[][] => {
    const newTrace = addElementToTrace(trace,possibleMove);
    const newCounter = newTrace.length;
    const newPossibleMoves = getPossibleMoves(possibleMove, prevStates, newCounter);

    const newPrevStateMap = addMovesToPrevStateMap(prevStates, newPossibleMoves, newCounter);
    const newTraces = getPossibleTraces(newPossibleMoves, endHanoi, newTrace, newPrevStateMap);

    return [...traces, ...newTraces];
}
export const getPossibleTraces = (possibleMoves: Hanoi[], endHanoi: Hanoi, trace: Hanoi[] = [], prevStates: prevStateMap | null = null): Hanoi[][] => {
    const prevStates_ = prevStates === null ? createPrevStateMapWithStartMoves(possibleMoves) : prevStates;

    return possibleMoves.reduce((acc: Hanoi[][], el: Hanoi): Hanoi[][] => {
        if (compareHanoi(el, endHanoi)) return [...acc, [...trace,el]];
        return addPossibleTraceForHanoiState(endHanoi, acc, trace, el, prevStates_)
    }, []);
}
export const getBestPossibleTrace = (hanoi: Hanoi, endHanoi: Hanoi): Hanoi[] | null => {
    const possibleTraces = getPossibleTraces([hanoi], endHanoi);

    const getBestReducer = (currentBestTrace: Hanoi[] | null, trace: Hanoi[]) => {
        const currentBestTraceDepth = currentBestTrace?.length;
        const newDepth = trace.length;
        if (currentBestTraceDepth === undefined) return trace;
        return newDepth < currentBestTraceDepth ? trace : currentBestTrace
    }

    return possibleTraces.reduce(getBestReducer, null)?.slice(1)||null;
}

