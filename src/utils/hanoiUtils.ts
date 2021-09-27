import { Hanoi, HanoiTower } from "../types";
import { addAsFirst, getFirst, isItemValidToMove, removeFirst } from "./hanoiTowerUtils";

type t = Hanoi;

type prevStateMapKey = string;
type prevStateMapValue = number;
type prevStateMap = Map<prevStateMapKey, prevStateMapValue>;

const getArrayAsString = JSON.stringify;
const createPrevStateMap = (): prevStateMap => new Map();
const addMoveToPrevStateMap = (prevState: prevStateMap, move: t, counter: number) => prevState.set(getArrayAsString(move), counter);
const addMovesToPrevStateMap = (prevState: prevStateMap, moves: t[], counter: number) => moves.reduce((acc, move) => addMoveToPrevStateMap(acc, move, counter), prevState);
const createPrevStateMapWithStartMoves = (moves: t[]): prevStateMap => addMovesToPrevStateMap(createPrevStateMap(),moves, 0);

export const getArrayOfLength = (length: number): Array<number> => new Array(length).fill(null).map((u, i) => i);
export const mapTowers = (hanoi: t, callback: (HanoiTower: HanoiTower, number: number) => HanoiTower) => hanoi.map(callback);
export const compareHanoi = (currentHanoi: t, endHanoi: t): boolean => getArrayAsString(currentHanoi) === getArrayAsString(endHanoi); // TODO: better array compare
export const getHanoiTowerByIndex = (hanoi: t, index: number): HanoiTower => hanoi[index];
export const getHanoiInPrevStates = (prevStatesMap: prevStateMap, hanoiState: t): number | undefined => prevStatesMap.get(getArrayAsString(hanoiState));
export const handleIsValidToMove = (hanoi: t, from: number, to: number) => from !== to && isItemValidToMove(hanoi[from], hanoi[to]);
export const moveItem = (hanoi: t, from: number, to: number): t => {
    const fromTower = getHanoiTowerByIndex(hanoi, from);
    const fromTowerFirstItem = getFirst(fromTower);

    const [firstTower, secondTower, thirdTower] = hanoi.map((el: HanoiTower, index: number) => {
        if (from === index) return removeFirst(el)
        if (to === index && fromTowerFirstItem) return addAsFirst(el, fromTowerFirstItem);
        return el;
    })
    return [firstTower, secondTower, thirdTower];
}
export const moveItemIfValid = (hanoi: t, from: number, to: number) => {
    return handleIsValidToMove(hanoi, from, to) ? moveItem(hanoi, from, to) : null;
}
export const getValidAndUniqueMove = (hanoi: t, from: number, to: number, prevStates: prevStateMap, counter: number) => {
    const move = moveItemIfValid(hanoi, from, to)

    if (!move) return null;
    const hanoiTraceCountFromPrevStates = getHanoiInPrevStates(prevStates, move);
    if (hanoiTraceCountFromPrevStates !==undefined && hanoiTraceCountFromPrevStates < counter) return null;

    return move;
}
export const addPossibleMoveForTowerIndex = (hanoi: t, prevStates: prevStateMap, moves: t[], towerIndex: number, possibleTowerIndex: number, counter: number): t[] => {
    const move = getValidAndUniqueMove(hanoi, towerIndex, possibleTowerIndex, prevStates, counter);
    return move ? [...moves, move] : moves;
};
export const addPossibleMovesForTowerIndex = (hanoi: t, prevStates: prevStateMap, moves: t[], tower: HanoiTower, towerIndex: number, counter: number) => {
    const arrayOfHanoiLenght = getArrayOfLength(hanoi.length);
    return arrayOfHanoiLenght.reduce((acc_, _, possibleTowerIndex) => addPossibleMoveForTowerIndex(hanoi, prevStates, acc_, towerIndex, possibleTowerIndex, counter), moves)
};
export const getPossibleMoves = (hanoi: t, prevStates: prevStateMap, counter: number): t[] =>
    hanoi.reduce((acc: t[], tower: HanoiTower, towerIndex: number) => addPossibleMovesForTowerIndex(hanoi, prevStates, acc, tower, towerIndex, counter), [])

export const addPossibleTraceForHanoiState = (endHanoi: t, traces: number[], counter: number, possibleMove: t, prevStates: prevStateMap): number[] => {
    const newCounter = counter + 1;
    const newPossibleMoves = getPossibleMoves(possibleMove, prevStates, newCounter);
    
    const newPrevStateMap = addMovesToPrevStateMap(prevStates, newPossibleMoves, newCounter);
    const newTraces = getPossibleTraces(newPossibleMoves, endHanoi, newCounter, newPrevStateMap);

    return [...traces, ...newTraces];
}
export const getPossibleTraces = (possibleMoves: t[], endHanoi: t, counter: number =0, prevStates: prevStateMap|null = null): number[] => {
    const prevStates_ = prevStates ===null? createPrevStateMapWithStartMoves(possibleMoves):prevStates;

    return possibleMoves.reduce((acc: number[], el: t): number[] => {
        if (compareHanoi(el, endHanoi)){
            return [...acc,counter]};
            return  addPossibleTraceForHanoiState(endHanoi, acc, counter, el, prevStates_)
    }, []);
}

export const getBestPossibleTrace = (hanoi: t, endHanoi: t): number => {
    const possibleTraces = getPossibleTraces([hanoi], endHanoi);
    return possibleTraces.reduce((acc: number, count: number) => (count && count < acc) ? count : acc, Infinity)
}
