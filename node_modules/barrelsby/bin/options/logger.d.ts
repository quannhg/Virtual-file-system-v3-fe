import { Signale } from 'signale';
export type Logger = Signale;
export declare function getLogger({ isVerbose }?: {
    isVerbose: boolean;
}): Logger;
