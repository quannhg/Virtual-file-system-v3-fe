import { InvalidPathResult, ValidPathResult } from '@interfaces';
import { FileType } from '@prisma/client';
import { prisma } from '@repositories';
import { resolveFullPath } from './resolveFullPath';

export async function normalizePath(path: string, isFilePath?: boolean): Promise<ValidPathResult | InvalidPathResult> {
    if (path.endsWith('/')) {
        if (isFilePath)
            return {
                invalid: true,
                message: 'File paths cannot end with a trailing slash. Please remove the "/" from the end of the path.'
            };

        path = path.slice(0, -1);

        const fileWithPath = await prisma.file.findFirst({ where: { path, type: FileType.RAW_FILE } });
        if (fileWithPath) {
            return {
                invalid: true,
                message: 'Path exists as a file, not a directory.'
            };
        }
    }

    let isAbs = false;
    if (path.startsWith('/')) {
        isAbs = true;
        path = path.slice(1);
    }
    if (path === '') return { invalid: false, path: isAbs ? '/' : '' };
    const subpaths = path.split('/');
    if (subpaths[subpaths.length - 1] === '') {
        subpaths.pop();
    }

    try {
        const normalizedPath = (path.startsWith('/') ? '' : '/') + subpaths.map(normalizeSubpath).join('/');

        // After normalizing the path, resolve any symlinks in the path
        const resultPath = await resolveFullPath(normalizedPath);

        return { invalid: false, path: resultPath };
    } catch (err) {
        return { invalid: true, message: err.message };
    }
}

function normalizeSubpath(subpath: string): string {
    const [, group0, group1, group2, group3] =
        subpath.match(/^(?:(?:"([a-zA-Z0-9 _-]+)")|(?:'([a-zA-Z0-9 _-]+)')|(?:([a-zA-Z0-9 _-]+)))$/) || [];
    const res = group0 || group1 || group2 || group3;
    if (res === undefined) {
        throw Error('Invalid path');
    }
    return res;
}
