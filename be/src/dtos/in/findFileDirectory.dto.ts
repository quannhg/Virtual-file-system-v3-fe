import { Static, Type } from '@sinclair/typebox';

export const FindFileDirectoryQueryStrings = Type.Object(
    {
        keyString: Type.String(),
        path: Type.String()
    },
    {
        examples: [
            {
                keyString: 'Example',
                path: '/'
            }
        ]
    }
);

export type FindFileDirectoryQueryStrings = Static<typeof FindFileDirectoryQueryStrings>;
