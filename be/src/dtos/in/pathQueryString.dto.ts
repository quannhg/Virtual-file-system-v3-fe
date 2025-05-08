import { Static, Type } from '@sinclair/typebox';

export const PathQueryStrings = Type.Object(
    {
        path: Type.String()
    },
    {
        examples: [
            {
                path: '/'
            }
        ]
    }
);

export type PathQueryStrings = Static<typeof PathQueryStrings>;
