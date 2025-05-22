import { FileType } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';

export const FileTypeEnum = Type.Union(
    (Object.values(FileType) as string[]).map((v) => Type.Literal(v))
);

export const ListDirectoryItem = Type.Object({
    name: Type.String(),
    type: FileTypeEnum,
    createAt: Type.String(),
    size: Type.Integer()
});

export type ListDirectoryItem = Static<typeof ListDirectoryItem>;
