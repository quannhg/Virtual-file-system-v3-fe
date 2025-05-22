export const appendPath = (currentPath: string, appendedPath: string): string => {
    if (appendedPath === '/' || appendedPath === '') return currentPath;

    const parts = appendedPath.replace(/^\/+|\/+$/g, '').split('/');
    let resultPath = currentPath;

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
            // Thêm phần mới vào đường dẫn một cách thủ công để tránh path.join
            resultPath = resultPath === '' || resultPath === '/' ? '/' + part : resultPath + (resultPath.endsWith('/') ? '' : '/') + part;
        }
    }

    // Đảm bảo đường dẫn bắt đầu bằng dấu /
    return resultPath.startsWith('/') ? resultPath : '/' + resultPath;
};
