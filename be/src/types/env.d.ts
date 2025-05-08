type Environment = 'development' | 'staging' | 'production' | 'test';

type EnvDecl<T = unknown> = {
    name: T;
    type: 'string' | 'number';
    required: boolean;
};
