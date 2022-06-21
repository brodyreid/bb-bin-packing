import ScoreBoardEntry from './ScoreBoardEntry';

export type PackedScores<T> = Partial<ScoreBoardEntry> & { box: T };
