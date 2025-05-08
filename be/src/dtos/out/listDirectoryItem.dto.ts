import { Static, Type } from '@sinclair/typebox';

export const ListDirectoryItem = Type.Object({
    name: Type.String(),
    createAt: Type.String(),
    size: Type.Integer()
});

export type ListDirectoryItem = Static<typeof ListDirectoryItem>;
