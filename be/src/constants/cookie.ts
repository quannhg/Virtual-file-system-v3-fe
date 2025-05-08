import { envs } from '@configs';

export const cookieOptions = {
    signed: false,
    secure: envs.NODE_ENV === 'production' || envs.NODE_ENV === 'staging',
    path: '/',
    httpOnly: true
};
