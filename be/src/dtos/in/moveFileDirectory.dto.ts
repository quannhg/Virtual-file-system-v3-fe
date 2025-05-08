import { Static, Type } from '@sinclair/typebox';

export const MoveFileDirectoryBody = Type.Object({
    oldPath: Type.String(),
    destinationPath: Type.String()
});

export type MoveFileDirectoryBody = Static<typeof MoveFileDirectoryBody>;
