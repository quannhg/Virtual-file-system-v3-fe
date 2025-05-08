import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';

/**
 * @param RS Response data type
 * @param RQ Request data type
 */
export type Handler<RS = unknown, RQ extends RouteGenericInterface = Record<string, never>> = (
    req: FastifyRequest<RQ>,
    res: FastifyReply
) => Result<RS>;
