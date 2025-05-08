import 'fastify';

declare module 'fastify' {
    interface FastifyRequest {
        user: RequestUser;
    }
    interface FastifyInstance {
        start: () => Promise<void>;
        shutdown: () => Promise<void>;
    }
}
