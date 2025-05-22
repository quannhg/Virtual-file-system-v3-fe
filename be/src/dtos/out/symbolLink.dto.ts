import { Static, Type } from '@sinclair/typebox';

export const SymbolLinkResult = Type.Object({
    content: Type.String({ default: 'Successfully symlink to file/directory' })
});

export type SymbolLinkResult = Static<typeof SymbolLinkResult>;
