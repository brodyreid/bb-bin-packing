export const RotationType_WHD: 0;
export const RotationType_HWD: 1;
export const RotationType_HDW: 2;
export const RotationType_DHW: 3;
export const RotationType_DWH: 4;
export const RotationType_WDH: 5;
export const WidthAxis: 0;
export const HeightAxis: 1;
export const DepthAxis: 2;
export const StartPosition: number[];
export const RotationTypeStrings: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
};
export default class Item {
    constructor(name: any, w: any, h: any, d: any, wg: any, allowedRotation: any);
    name: string;
    width: number;
    height: number;
    depth: number;
    weight: number;
    allowedRotation: number[];
    rotationType: number;
    position: any[];
    getWidth(): number;
    getHeight(): number;
    getDepth(): number;
    getWeight(): number;
    getRotationType(): number;
    getAllowedRotation(): number[];
    getRotationTypeString(): any;
    getDimension(): number[];
    intersect(i2: any): boolean;
    getVolume(): number;
    toString(): string;
}
export function rectIntersect(i1: any, i2: any, x: any, y: any): boolean;
//# sourceMappingURL=Item.d.ts.map