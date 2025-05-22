# Prisma to SQL Query Mapping

This document maps the Prisma ORM queries used in the Virtual File System API to their equivalent raw SQL queries. This can be helpful for understanding the underlying database operations or for debugging purposes.

## Table of Contents

1. [Database Schema](#database-schema)
2. [Find Operations](#find-operations)
    - [findFirst](#findfirst)
    - [findMany](#findmany)
3. [Create Operations](#create-operations)
    - [create](#create)
    - [createMany](#createmany)
4. [Update Operations](#update-operations)
    - [update](#update)
    - [upsert](#upsert)
5. [Delete Operations](#delete-operations)
    - [deleteMany](#deletemany)
6. [Transaction Operations](#transaction-operations)
7. [Raw SQL Queries](#raw-sql-queries)

## Database Schema

The Virtual File System uses two main tables:

```sql
CREATE TABLE `File` (
  `path` VARCHAR(191) NOT NULL,
  `type` ENUM('RAW_FILE', 'DIRECTORY', 'SYMLINK') NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `targetPath` VARCHAR(191) NULL,

  PRIMARY KEY (`path`),
  INDEX `path_idx` (`path`)
);

CREATE TABLE `Content` (
  `path` VARCHAR(191) NOT NULL,
  `data` TEXT NOT NULL,

  PRIMARY KEY (`path`),
  INDEX `path_idx` (`path`),
  FOREIGN KEY (`path`) REFERENCES `File` (`path`) ON DELETE CASCADE ON UPDATE CASCADE
);
```

## Find Operations

### findFirst

#### Check if a file exists

**Prisma:**

```typescript
const file = await prisma.content.findFirst({
    where: {
        path
    },
    select: {
        data: true
    }
});
```

**SQL:**

```sql
SELECT `data`
FROM `Content`
WHERE `path` = ?
LIMIT 1;
```

#### Check if a path is a file

**Prisma:**

```typescript
const exactFile = await prisma.file.findFirst({
    where: {
        path: path.slice(0, -1),
        type: FileType.RAW_FILE
    }
});
```

**SQL:**

```sql
SELECT *
FROM `File`
WHERE `path` = ? AND `type` = 'RAW_FILE'
LIMIT 1;
```

#### Check if a directory exists

**Prisma:**

```typescript
const folderExist = await prisma.file.findFirst({
    where: {
        OR: [{ path: path.slice(0, -1), type: FileType.DIRECTORY }, { path: { startsWith: path } }]
    }
});
```

**SQL:**

```sql
SELECT *
FROM `File`
WHERE (`path` = ? AND `type` = 'DIRECTORY') OR `path` LIKE CONCAT(?, '%')
LIMIT 1;
```

#### Get file details with content

**Prisma:**

```typescript
const directFile = await prisma.file.findFirst({
    where: {
        path: itemPath,
        type: FileType.RAW_FILE
    },
    select: {
        path: true,
        createdAt: true,
        Content: { select: { data: true } }
    }
});
```

**SQL:**

```sql
SELECT f.`path`, f.`createdAt`, c.`data`
FROM `File` f
LEFT JOIN `Content` c ON f.`path` = c.`path`
WHERE f.`path` = ? AND f.`type` = 'RAW_FILE'
LIMIT 1;
```

#### Get first folder item by creation time

**Prisma:**

```typescript
const firstFolderItem = await prisma.file.findFirst({
    where: {
        path: { startsWith: itemPath },
        type: FileType.DIRECTORY
    },
    orderBy: { createdAt: 'asc' }
});
```

**SQL:**

```sql
SELECT *
FROM `File`
WHERE `path` LIKE CONCAT(?, '%') AND `type` = 'DIRECTORY'
ORDER BY `createdAt` ASC
LIMIT 1;
```

### findMany

#### Get all items in a directory

**Prisma:**

```typescript
const items = await prisma.file.findMany({
    where: {
        path: { startsWith: path }
    },
    select: {
        path: true,
        createdAt: true,
        type: true,
        Content: true
    }
});
```

**SQL:**

```sql
SELECT f.`path`, f.`createdAt`, f.`type`, c.*
FROM `File` f
LEFT JOIN `Content` c ON f.`path` = c.`path`
WHERE f.`path` LIKE CONCAT(?, '%');
```

#### Find items matching a search string

**Prisma:**

```typescript
const matchingItems = await prisma.file.findMany({
    where: {
        path: {
            startsWith: path,
            contains: keyString
        }
    },
    select: {
        path: true,
        type: true
    }
});
```

**SQL:**

```sql
SELECT `path`, `type`
FROM `File`
WHERE `path` LIKE CONCAT(?, '%') AND `path` LIKE CONCAT('%', ?, '%');
```

#### Find items to move or update

**Prisma:**

```typescript
const updateItems = await prisma.file.findMany({
    where: {
        OR: [{ path: { startsWith: oldPath + '/' } }, { path: oldPath }]
    },
    select: {
        path: true,
        type: true
    }
});
```

**SQL:**

```sql
SELECT `path`, `type`
FROM `File`
WHERE `path` LIKE CONCAT(?, '/%') OR `path` = ?;
```

#### Get latest item of parent

**Prisma:**

```typescript
const latestItemOfParent = await prisma.file.findMany({
    where: { path: { startsWith: parentPath } },
    orderBy: { createdAt: 'asc' },
    take: 1
});
```

**SQL:**

```sql
SELECT *
FROM `File`
WHERE `path` LIKE CONCAT(?, '%')
ORDER BY `createdAt` ASC
LIMIT 1;
```

## Create Operations

### create

#### Create a file with content

**Prisma:**

```typescript
await prisma.file.create({
    data: {
        path: newPath,
        type: FileType.RAW_FILE,
        Content: {
            create: {
                data
            }
        }
    }
});
```

**SQL:**

```sql
-- This is executed as a transaction
BEGIN;
INSERT INTO `File` (`path`, `type`, `createdAt`)
VALUES (?, 'RAW_FILE', DEFAULT);

INSERT INTO `Content` (`path`, `data`)
VALUES (?, ?);
COMMIT;
```

#### Create a directory

**Prisma:**

```typescript
await prisma.file.create({
    data: {
        path: newPath,
        type: FileType.DIRECTORY
    }
});
```

**SQL:**

```sql
INSERT INTO `File` (`path`, `type`, `createdAt`)
VALUES (?, 'DIRECTORY', DEFAULT);
```

### createMany

#### Create multiple files/directories

**Prisma:**

```typescript
await prisma.file.createMany({
    data: [
        {
            path: '/example/path/to/another_file_txt',
            type: FileType.RAW_FILE
        },
        {
            path: '/example/path/to/subdirectory',
            type: FileType.DIRECTORY
        }
    ]
});
```

**SQL:**

```sql
INSERT INTO `File` (`path`, `type`, `createdAt`)
VALUES
  ('/example/path/to/another_file_txt', 'RAW_FILE', DEFAULT),
  ('/example/path/to/subdirectory', 'DIRECTORY', DEFAULT);
```

## Update Operations

### update

#### Update file path

**Prisma:**

```typescript
await prisma.file.update({
    where: {
        path: oldPath
    },
    data: {
        path: newPath
    }
});
```

**SQL:**

```sql
UPDATE `File`
SET `path` = ?
WHERE `path` = ?;
```

### upsert

#### Update or create file content

**Prisma:**

```typescript
await prisma.content.upsert({
    where: {
        path: newPath
    },
    update: {
        data: newData
    },
    create: {
        path: newPath,
        data: newData
    }
});
```

**SQL:**

```sql
INSERT INTO `Content` (`path`, `data`)
VALUES (?, ?)
ON DUPLICATE KEY UPDATE `data` = ?;
```

## Delete Operations

### deleteMany

#### Delete files and content

**Prisma:**

```typescript
await prisma.content.deleteMany({
    where: {
        OR: [{ path: { startsWith: removePath + '/' } }, { path: removePath }]
    }
});

await prisma.file.deleteMany({
    where: {
        OR: [{ path: { startsWith: removePath + '/' } }, { path: removePath }]
    }
});
```

**SQL:**

```sql
DELETE FROM `Content`
WHERE `path` LIKE CONCAT(?, '/%') OR `path` = ?;

DELETE FROM `File`
WHERE `path` LIKE CONCAT(?, '/%') OR `path` = ?;
```

## Transaction Operations

#### Update file and content in a transaction

**Prisma:**

```typescript
await prisma.$transaction(async (prisma) => {
    await prisma.file.update({
        where: {
            path: oldPath
        },
        data: {
            path: newPath
        }
    });

    await prisma.content.upsert({
        where: {
            path: newPath
        },
        update: {
            data: newData
        },
        create: {
            path: newPath,
            data: newData
        }
    });
});
```

**SQL:**

```sql
BEGIN;
UPDATE `File`
SET `path` = ?
WHERE `path` = ?;

INSERT INTO `Content` (`path`, `data`)
VALUES (?, ?)
ON DUPLICATE KEY UPDATE `data` = ?;
COMMIT;
```

## Raw SQL Queries

#### Calculate folder size

**Prisma:**

```typescript
const folderSizeResult: { size: string }[] =
    await prisma.$queryRaw`SELECT SUM(CHAR_LENGTH(data)) AS size FROM Content WHERE path LIKE CONCAT(${itemPath}, '/', '%')`;
```

**SQL:**

```sql
SELECT SUM(CHAR_LENGTH(data)) AS size
FROM Content
WHERE path LIKE CONCAT(?, '/', '%');
```

#### Check for existing path

**Prisma:**

```typescript
const existingPathResult: { path: string }[] = await prisma.$queryRaw`
  SELECT path
  FROM File
  WHERE (path = ${newPath}) OR
  (path LIKE CONCAT(${newPath}, '/' , '%')) OR
  (type = ${FileType.RAW_FILE} AND ${newPath} LIKE CONCAT(path, '/', '%'))
`;
```

**SQL:**

```sql
SELECT path
FROM File
WHERE (path = ?) OR
(path LIKE CONCAT(?, '/' , '%')) OR
(type = 'RAW_FILE' AND ? LIKE CONCAT(path, '/', '%'));
```
