export declare class Store {
    private data;
    private _key;
    get key(): string;
    private readonly path;
    constructor();
    set(filename: string, name: string, id: string): string;
    get(filename: string, name: string): string | undefined;
    empty(): void;
    private _save;
    save(): void;
    private createApiMap;
}
