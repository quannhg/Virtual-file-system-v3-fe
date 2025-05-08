import { Static, Type } from '@sinclair/typebox';

export const FindFileDirectoryQueryStrings = Type.Object(
    {
        keyString: Type.String(),
        path: Type.String(),
        contentSearch: Type.Optional(Type.String())
    },
    {
        examples: [
            {
                keyString: 'Example',
                path: '/',
                contentSearch: 'example content'
            }
        ]
    }
);

export type FindFileDirectoryQueryStrings = Static<typeof FindFileDirectoryQueryStrings>;
