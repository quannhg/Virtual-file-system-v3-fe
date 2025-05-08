import { Static, Type } from '@sinclair/typebox';

export const SingleMessageResult = Type.Object({
    message: Type.String({ default: 'Successfully change directory' })
});

export type SingleMessageResult = Static<typeof SingleMessageResult>;
