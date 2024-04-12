export declare const mergeRecord: <T extends Record<string, unknown>, S extends Record<string, unknown>>(a: T, b: S) => T & S;
export declare const mergeArray: <T>(a: T[], b: T[]) => T[];
