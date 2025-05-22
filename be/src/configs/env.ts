import { config as configEnv } from 'dotenv';
import { cleanEnv, str, json, num } from 'envalid';
configEnv();

export const envs = cleanEnv(process.env, {
    NODE_ENV: str<Environment>({
        devDefault: 'development',
        choices: ['development', 'test', 'production', 'staging']
    }),
    TEST_POSTGRES_USER: str({ default: 'mihon' }),
    TEST_POSTGRES_PASSWORD: str({ default: '123456789' }),
    TEST_POSTGRES_DB: str({ default: 'virtual file system ' }),

    JWT_SECRET: str(),
    COOKIE_SECRET: str(),
    CORS_WHITE_LIST: json<string[]>(),

    // Redis configuration
    REDIS_HOST: str({ default: 'localhost' }),
    REDIS_PORT: num({ default: 6379 }),
    REDIS_PASSWORD: str({ default: '' }),
    REDIS_DB: num({ default: 0 }),
    REDIS_PREFIX: str({ default: 'vfs:' })
});
