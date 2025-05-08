import { Nullable } from '@dtos/common';
import { Static, Type } from '@sinclair/typebox';

export const CreateFileDirectoryBody = Type.Object({
    path: Type.String(),
    shouldCreateParent: Type.Boolean(),
    data: Nullable(Type.String())
});

export type CreateFileDirectoryBody = Static<typeof CreateFileDirectoryBody>;
