export declare const defineConfig: (userConfig: Partial<TvvinsConfig>) => TvvinsConfig & Partial<TvvinsConfig>;
type TvvinsConfig = {
    base: string;
    apiDir: string;
};
export type Server = any;
export declare const createServer: () => void;
export {};
