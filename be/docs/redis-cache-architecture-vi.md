# Kiến Trúc Redis Cache trong API Hệ Thống Tệp Ảo

Tài liệu này cung cấp tổng quan về việc triển khai Redis cache trong API Hệ Thống Tệp Ảo, mô tả chi tiết các tính năng nào set/get cache và các tính năng nào invalidate cache.

## Mục Lục

1. [Tổng Quan Architecture](#tổng-quan-architecture)
2. [Cấu Trúc Cache Keys](#cấu-trúc-cache-keys)
3. [Cache Operations Theo Feature](#cache-operations-theo-feature)
4. [Cache Invalidation Flow](#cache-invalidation-flow)
5. [Monitoring và Statistics](#monitoring-và-statistics)

## Tổng Quan Architecture

Hệ thống sử dụng Redis làm in-memory data store để lưu trữ dữ liệu được truy cập thường xuyên, giảm tải database và cải thiện response time. Việc triển khai tuân theo các nguyên tắc sau:

- **Read-through caching**: API endpoints kiểm tra cache trước khi query database
- **Write-through invalidation**: Write operations invalidate các cache entries bị ảnh hưởng
- **TTL-based expiration**: Tất cả cache entries đều có time-to-live để ngăn stale data
- **Hierarchical invalidation**: Operations trên một path invalidate các parent paths khi cần thiết

```mermaid
flowchart TD
    A[API Request] --> B[Cache Check]
    B -->|Cache Hit| D[Cache Result]
    B -->|Cache Miss| C[Database Query]
    C --> E[Cache Update]
    E --> D
    D --> F[API Response]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
    style D fill:#bbf,stroke:#333,stroke-width:2px
    style E fill:#bbf,stroke:#333,stroke-width:2px
    style F fill:#f9f,stroke:#333,stroke-width:2px
```

## Cấu Trúc Cache Keys

Hệ thống sử dụng structured key patterns để tổ chức các loại cached data khác nhau:

| Cache Type        | Key Pattern           | Example                         |
| ----------------- | --------------------- | ------------------------------- |
| File Content      | `file:content:{path}` | `file:content:/docs/report.txt` |
| Directory Listing | `dir:listing:{path}`  | `dir:listing:/docs`             |

```mermaid
classDiagram
    class CacheKeys {
        +fileContent(path) string
        +directoryListing(path) string
    }
    
    class RedisCache {
        +get(key) any
        +set(key, value, ttl) void
        +del(key) void
        +scan(cursor, pattern) array
    }
    
    CacheKeys --> RedisCache : generates keys for
```

## Cache Operations Theo Feature

### Features That Get/Set Cache

| API Endpoint | Handler            | Cache Operation | Cache Type        | TTL            |
| ------------ | ------------------ | --------------- | ----------------- | -------------- |
| GET /api/cat | showFileContent    | Get & Set       | File Content      | 3600s (1 hour) |
| GET /api/ls  | listDirectoryItems | Get & Set       | Directory Listing | 1800s (30 min) |

```mermaid
flowchart TD
    subgraph "Cache Read Operations"
        cat["GET /cat<br>File Content"]
        ls["GET /ls<br>Directory Listing"]
    end
    
    redis[Redis Cache]
    
    cat --> redis
    ls --> redis
    
    style cat fill:#f96,stroke:#333,stroke-width:2px
    style ls fill:#f96,stroke:#333,stroke-width:2px
    style redis fill:#bbf,stroke:#333,stroke-width:2px
```

### Features That Invalidate Cache

| API Endpoint   | Handler             | Cache Invalidation              | Affected Cache Types            |
| -------------- | ------------------- | ------------------------------- | ------------------------------- |
| POST /api/cr   | createFileDirectory | Parent directory                | Directory Listing               |
| PUT /api/up    | updateFileDirectory | File content, Directory listing | File Content, Directory Listing |
| PUT /api/mv    | moveFileDirectory   | Source & destination paths      | File Content, Directory Listing |
| DELETE /api/rm | removeFileDirectory | File content, Parent directory  | File Content, Directory Listing |

## Cache Invalidation Flow

Cache invalidation flow đảm bảo data consistency bằng cách xóa các cache entries bị ảnh hưởng khi data thay đổi:

```mermaid
flowchart TD
    subgraph "Cache Write Operations"
        cr["POST /cr<br>Create"]
        up["PUT /up<br>Update"]
        mv["PUT /mv<br>Move"]
        rm["DELETE /rm<br>Remove"]
    end
    
    invalidation[Cache Invalidation Layer]
    redis[Redis Cache]
    
    cr --> invalidation
    up --> invalidation
    mv --> invalidation
    rm --> invalidation
    
    invalidation --> redis
    
    style cr fill:#f66,stroke:#333,stroke-width:2px
    style up fill:#f66,stroke:#333,stroke-width:2px
    style mv fill:#f66,stroke:#333,stroke-width:2px
    style rm fill:#f66,stroke:#333,stroke-width:2px
    style invalidation fill:#ff9,stroke:#333,stroke-width:2px
    style redis fill:#bbf,stroke:#333,stroke-width:2px
```

### Detailed Invalidation Logic

1. **File Creation (POST /api/cr)**:
   - Invalidates parent directory listing cache
   - Example: Creating `/docs/new.txt` invalidates `dir:listing:/docs`

2. **File/Directory Update (PUT /api/up)**:
   - Invalidates file content cache for the updated file
   - Invalidates directory listing cache for the parent directory
   - Example: Updating `/docs/report.txt` invalidates `file:content:/docs/report.txt` and `dir:listing:/docs`

3. **File/Directory Move (PUT /api/mv)**:
   - Invalidates file content cache for the moved file
   - Invalidates directory listing cache for both source and destination parent directories
   - Example: Moving `/docs/report.txt` to `/archive/report.txt` invalidates `file:content:/docs/report.txt`, `file:content:/archive/report.txt`, `dir:listing:/docs`, and `dir:listing:/archive`

4. **File/Directory Removal (DELETE /api/rm)**:
   - Invalidates file content cache for the removed file
   - Invalidates directory listing cache for the parent directory
   - Example: Removing `/docs/report.txt` invalidates `file:content:/docs/report.txt` and `dir:listing:/docs`

## Monitoring và Statistics

Hệ thống bao gồm các monitoring capabilities để track performance:

- **Cache Hit/Miss Rates**: Tracks overall và per-endpoint cache effectiveness
- **API Endpoints**: GET /api/cache/stats và POST /api/cache/reset cho monitoring và management
- **Logging**: Detailed logs cho cache operations và invalidations

```mermaid
flowchart TD
    subgraph "Cache Statistics"
        hit[Hit Rate]
        miss[Miss Rate]
        endpoint["Per-Endpoint<br>Statistics"]
        uptime[Uptime]
    end
    
    stats[GET /api/cache/stats]
    
    hit --> stats
    miss --> stats
    endpoint --> stats
    uptime --> stats
    
    subgraph "Endpoints"
        fileContent[File Content]
        dirListing[Directory Listing]
    end
    
    endpoint --> fileContent
    endpoint --> dirListing
    
    style hit fill:#6f6,stroke:#333,stroke-width:2px
    style miss fill:#f66,stroke:#333,stroke-width:2px
    style endpoint fill:#66f,stroke:#333,stroke-width:2px
    style uptime fill:#ff9,stroke:#333,stroke-width:2px
    style stats fill:#f9f,stroke:#333,stroke-width:2px
    style fileContent fill:#bbf,stroke:#333,stroke-width:2px
    style dirListing fill:#bbf,stroke:#333,stroke-width:2px
```

Kiến trúc cache này cung cấp cải thiện performance đáng kể cho read-heavy operations trong khi vẫn duy trì data consistency thông qua proper cache invalidation cho write operations.
