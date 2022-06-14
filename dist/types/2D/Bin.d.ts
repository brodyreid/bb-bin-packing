import Box from './Box';
export default class Bin {
    width: number;
    height: number;
    boxes: Box[];
    heuristic: any;
    freeRectangles: FreeSpaceBox[];
    constructor(width: number, height: number, heuristic: any);
    get area(): number;
    get efficiency(): number;
    get label(): string;
    insert(box: Box): boolean;
    scoreFor(box: Box): any;
    isLargerThan(box: Box): boolean;
    splitFreeNode(freeNode: any, usedNode: any): boolean;
    trySplitFreeNodeVertically(freeNode: any, usedNode: any): void;
    tryLeaveFreeSpaceAtTop(freeNode: any, usedNode: any): void;
    tryLeaveFreeSpaceAtBottom(freeNode: any, usedNode: any): void;
    trySplitFreeNodeHorizontally(freeNode: any, usedNode: any): void;
    tryLeaveFreeSpaceOnLeft(freeNode: any, usedNode: any): void;
    tryLeaveFreeSpaceOnRight(freeNode: any, usedNode: any): void;
    /**
     * Goes through the free rectangle list and removes any redundant entries.
     */
    pruneFreeList(): void;
    isContainedIn(rectA: any, rectB: any): boolean;
}
export declare class FreeSpaceBox {
    x: number;
    y: number;
    width: any;
    height: any;
    constructor(width: any, height: any);
}
//# sourceMappingURL=Bin.d.ts.map