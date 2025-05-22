import {
    changeDirectory,
    createFileDirectory,
    createSymLinkItems,
    findDirectoryItems,
    getCacheStats,
    listDirectoryItems,
    moveFileDirectory,
    removeFileDirectory,
    resetCacheStats,
    showFileContent,
    updateFileDirectory,
    grepFiles
} from '@handlers';
import {
    PathQueryStrings,
    CreateFileDirectoryBody,
    UpdateFileDirectoryBody,
    RemoveFileDirectory,
    MoveFileDirectoryBody,
    FindFileDirectoryQueryStrings,
    GrepFileQueryStrings
} from '@dtos/in';
import { createRoute } from '@utils';
import { Type } from '@sinclair/typebox';
import { DIRECTORY_NOT_FOUND, FILE_NOT_FOUND } from '@constants';
import {
    CacheStatsResult,
    CreateFileDirectoryResult,
    ListDirectoryItem,
    ResetCacheStatsResult,
    ShowFileContentResult,
    SingleMessageResult,
    GrepFileResult
} from '@dtos/out';

export const apiRoute = createRoute('Api', [
    {
        method: 'GET',
        url: '/cd',
        schema: {
            summary: 'Change current directory',
            querystring: PathQueryStrings,
            response: {
                200: SingleMessageResult,
                400: Type.Object({ message: Type.String({ default: DIRECTORY_NOT_FOUND }) })
            }
        },
        handler: changeDirectory
    },
    {
        method: 'POST',
        url: '/cr',
        schema: {
            summary: 'Create new file or directory',
            body: CreateFileDirectoryBody,
            response: {
                200: CreateFileDirectoryResult,
                400: Type.Object({ message: Type.String() })
            }
        },
        handler: createFileDirectory
    },
    {
        method: 'GET',
        url: '/cat',
        schema: {
            summary: 'Retrieve content of the file',
            querystring: PathQueryStrings,
            response: {
                200: ShowFileContentResult,
                400: Type.Object({ message: Type.String({ default: FILE_NOT_FOUND }) })
            }
        },
        handler: showFileContent
    },
    {
        method: 'GET',
        url: '/ls',
        schema: {
            summary: 'List all items in directory',
            querystring: PathQueryStrings,
            response: {
                200: Type.Array(ListDirectoryItem),
                400: Type.Object({ message: Type.String({ default: DIRECTORY_NOT_FOUND }) })
            }
        },
        handler: listDirectoryItems
    },
    {
        method: 'POST',
        url: '/ln',
        schema: {
            summary: 'Create symbolic link',
            body: Type.Object({
                targetPath: Type.String(),
                path: Type.String(),
                shouldCreateParent: Type.Optional(Type.Boolean({ default: false }))
            }),
            response: {
                200: SingleMessageResult,
                400: Type.Object({ message: Type.String() })
            }
        },
        handler: createSymLinkItems
    },
    {
        method: 'GET',
        url: '/find',
        schema: {
            summary: 'Find all items in directory',
            querystring: FindFileDirectoryQueryStrings,
            response: {
                200: Type.Array(Type.String()),
                400: Type.Object({ message: Type.String({ default: DIRECTORY_NOT_FOUND }) })
            }
        },
        handler: findDirectoryItems
    },
    {
        method: 'PUT',
        url: '/up',
        schema: {
            summary: 'Update file or directory',
            body: UpdateFileDirectoryBody,
            response: {
                200: SingleMessageResult,
                400: Type.Object({ message: Type.String({ default: DIRECTORY_NOT_FOUND }) })
            }
        },
        handler: updateFileDirectory
    },
    {
        method: 'PUT',
        url: '/mv',
        schema: {
            summary: 'Move files or directories',
            body: MoveFileDirectoryBody,
            response: {
                200: SingleMessageResult,
                400: Type.Object({ message: Type.String({ default: DIRECTORY_NOT_FOUND }) })
            }
        },
        handler: moveFileDirectory
    },
    {
        method: 'DELETE',
        url: '/rm',
        schema: {
            summary: 'Remove files or directories',
            querystring: RemoveFileDirectory,
            response: {
                200: SingleMessageResult,
                400: Type.Object({ message: Type.String({ default: DIRECTORY_NOT_FOUND }) })
            }
        },
        handler: removeFileDirectory
    },
    {
        method: 'GET',
        url: '/cache/stats',
        schema: {
            summary: 'Get cache statistics',
            response: {
                200: CacheStatsResult,
                500: Type.Object({ message: Type.String() })
            }
        },
        handler: getCacheStats
    },
    {
        method: 'POST',
        url: '/cache/reset',
        schema: {
            summary: 'Reset cache statistics',
            response: {
                200: ResetCacheStatsResult,
                500: Type.Object({ message: Type.String() })
            }
        },
        handler: resetCacheStats
    },
    {
        method: 'GET',
        url: '/grep',
        schema: {
            summary: 'Search files by content and path',
            querystring: GrepFileQueryStrings,
            response: {
                200: Type.Array(GrepFileResult), // ✅ Sửa thành DTO bạn đã định nghĩa
                400: Type.Object({ message: Type.String({ default: DIRECTORY_NOT_FOUND }) })
            }
        },
        handler: grepFiles
    }
]);
