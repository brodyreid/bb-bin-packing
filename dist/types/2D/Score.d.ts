export default class Score {
    static MAX_INT: number;
    score_1: number;
    score_2: number;
    constructor(score_1?: number, score_2?: number);
    /**
     * Lower is better
     */
    valueOf(): number;
    assign(other: any): void;
    isBlank(): boolean;
    decreaseBy(delta: any): void;
}
//# sourceMappingURL=Score.d.ts.map