import { Logger } from './options/logger';
import { Directory } from './interfaces/directory.interface';
export declare function purge(rootTree: Directory, shouldPurge: boolean, noHeader: boolean, barrelName: string, logger: Logger): void;
