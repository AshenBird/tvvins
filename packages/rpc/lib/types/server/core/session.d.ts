export declare class Session {
    id: string;
    private map;
    constructor(id: string);
    get(key: string): any;
    set<T>(key: string, value: T): T;
    clear(): void;
    delete(key: string): boolean;
}
