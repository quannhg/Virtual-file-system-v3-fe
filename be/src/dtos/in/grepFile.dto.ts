import { Static, Type } from '@sinclair/typebox';

export const GrepFileQueryStrings = Type.Object(
    {
        path: Type.Optional(Type.String()),
        contentSearch: Type.String(),
        recursive: Type.Optional(Type.Union([Type.Literal('true'), Type.Literal('false')]))
    },
    {
        examples: [
            {
                path: '/',
                contentSearch: 'error',
                recursive: 'true' // 👈 ví dụ thêm
            }
        ]
    }
);

export type GrepFileQueryStrings = Static<typeof GrepFileQueryStrings>;
