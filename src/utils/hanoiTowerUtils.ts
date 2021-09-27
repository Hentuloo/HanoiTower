import { HanoiElement, HanoiTower } from "../types";

type t = HanoiTower;

export const getFirst = (tower: t): HanoiElement | null => tower[0] || null;
export const addAsFirst = (tower: t, element: HanoiElement): t => [element, ...tower];
export const removeFirst = (tower: t): HanoiTower => tower.slice(1);
export const isItemValidToMove = (from: t, to: t): boolean => {
    const firstInOldTower = getFirst(from);
    const firstInNewTower = getFirst(to) || Infinity;

    if (firstInOldTower === null) return false;
    return firstInNewTower > firstInOldTower
};
