import { Static, Type } from '@sinclair/typebox';

export const RemoveFileDirectory = Type.Object({
    paths: Type.Array(Type.String())
});

export type RemoveFileDirectory = Static<typeof RemoveFileDirectory>;
