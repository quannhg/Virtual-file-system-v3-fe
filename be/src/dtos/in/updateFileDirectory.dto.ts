import { Nullable } from '@dtos/common';
import { Static, Type } from '@sinclair/typebox';

export const UpdateFileDirectoryBody = Type.Object({
    oldPath: Type.String(),
    newPath: Type.String(),
    newData: Nullable(Type.String())
});

export type UpdateFileDirectoryBody = Static<typeof UpdateFileDirectoryBody>;
