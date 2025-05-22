import { Static, Type } from '@sinclair/typebox';

export const GrepFileResult = Type.Object({
    path: Type.String(),
    content: Type.String()
});

export type GrepFileResult = Static<typeof GrepFileResult>;
