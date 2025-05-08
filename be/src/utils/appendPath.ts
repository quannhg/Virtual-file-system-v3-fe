import path from 'path';

export const appendPath = (currentPath: string, appendedPath: string): string => {
    if (appendedPath === '/' || appendedPath === '') return currentPath;

    const parts = appendedPath.replace(/^\/+|\/+$/g, '').split('/');
    let resultPath = path.join(currentPath);

    for (const part of parts) {
        if (part === '..') {
            const splitPath = resultPath.split('/');
            if (splitPath.length > 1) {
                splitPath.pop();
                resultPath = splitPath.join('/') || '';
            }
        } else if (part === '--') {
            resultPath = '';
        } else {
            resultPath = path.join(resultPath, part);
        }
    }

    return resultPath[0] === '/' ? resultPath : '/' + resultPath;
};
