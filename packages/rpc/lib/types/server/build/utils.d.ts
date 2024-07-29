import { TransformResult } from 'vite';
import { Store } from '../core/store';
export declare const transform: (code: string, id: string, store: Store) => Promise<TransformResult>;
