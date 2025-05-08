import { Static, Type } from '@sinclair/typebox';

export const ShowFileContentResult = Type.Object({
    data: Type.String()
});

export type ShowFileContentResult = Static<typeof ShowFileContentResult>;
