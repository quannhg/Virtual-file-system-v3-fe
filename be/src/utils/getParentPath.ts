export const getParentPath = (path: string) => {
    const parts = path.split('/');
    if (parts[parts.length - 1] === '') {
        parts.pop();
    }
    return parts.slice(0, -1).join('/');
};
