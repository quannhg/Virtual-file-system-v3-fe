export interface ValidPathResult {
    invalid: false;
    path: string;
}

export interface InvalidPathResult {
    invalid: true;
    message: string;
}
