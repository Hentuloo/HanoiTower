import { HanoiElement, HanoiTower } from "../types";

export const getFirst = (tower: HanoiTower): HanoiElement | null => tower[0] || null;
export const addAsFirst = (tower: HanoiTower, element: HanoiElement): HanoiTower => [element, ...tower];
export const removeFirst = (tower: HanoiTower): HanoiTower => tower.slice(1);
export const isItemValidToMove = (from: HanoiTower, to: HanoiTower): boolean => {
    const firstInOldTower = getFirst(from);
    const firstInNewTower = getFirst(to) || Infinity;

    if (firstInOldTower === null) return false;
    return firstInNewTower > firstInOldTower
};
