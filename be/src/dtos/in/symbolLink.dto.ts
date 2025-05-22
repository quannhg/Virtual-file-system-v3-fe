import { Static, Type } from '@sinclair/typebox';


export const SymbolLinkBody = Type.Object({
    path: Type.String(),
    shouldCreateParent: Type.Optional(Type.Boolean()),
    targetPath: Type.Optional(Type.String()),
});

export type SymbolLinkBody = Static<typeof SymbolLinkBody>;