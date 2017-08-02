import * as Hapi from "hapi";
import * as Joi from "joi";
import * as JWT from "../jwt";
import * as Boom from "boom";
import { getEntityManager } from "typeorm";
import { IConfig } from "../configs";
import { Scout, IScout } from "./scout";
import { v4 as uuid } from "uuid"

export function register(server: Hapi.Server, config: IConfig) {

    // GET: /scouts/{id}
    server.route({
        method: 'GET',
        path: '/scouts/{id}',
        config: {
            auth: 'jwt',
            handler: async (request: Hapi.Request, reply: Hapi.ReplyNoContinue) => {

                let id = request.params["id"];

                // Find scout by id
                let repo = getEntityManager().getRepository(Scout);
                let scout = await repo.findOneById(id);

                // Make sure the scout exists
                if (!scout) {
                    return reply(Boom.badRequest("Scout does not exist"));
                }

                reply(scout);
            },
            validate: {
                headers: JWT.jwtValidator,
                params: {
                    id: Joi.string().required()
                },
            },
            tags: ['api', 'scouts'],
            description: 'Get scout by id'
        }
    });

    // GET: /scouts
    server.route({
        method: 'GET',
        path: '/scouts',
        config: {
            auth: 'jwt',
            handler: async (request: Hapi.Request, reply: Hapi.ReplyNoContinue) => {

                // Find all scouts
                let repo = getEntityManager().getRepository(Scout);
                let scouts = await repo.find();

                reply(scouts);
            },
            validate: {
                headers: JWT.jwtValidator
            },
            tags: ['api', 'scouts'],
            description: 'Get all scouts'
        }
    });

    // POST: /scouts
    server.route({
        method: 'POST',
        path: '/scouts',
        config: {
            auth: 'jwt',
            handler: async (request: Hapi.Request, reply: Hapi.ReplyNoContinue) => {

                // Create scout
                let scout: IScout = request.payload;
                scout.id = uuid();
                scout.createdAt = new Date();

                // Save scout
                let repo = getEntityManager().getRepository(Scout);
                await repo.persist(scout);

                reply(scout);
            },
            validate: {
                headers: JWT.jwtValidator,
                payload: Joi.object().keys({
                    name: Joi.string().required(),
                    rank: Joi.string().required()
                })
            },
            tags: ['api', 'scouts'],
            description: 'Add a scout'
        }
    });

    // PUT: /scouts
    server.route({
        method: 'PUT',
        path: '/scouts/{id}',
        config: {
            auth: 'jwt',
            handler: async (request: Hapi.Request, reply: Hapi.ReplyNoContinue) => {

                let id = request.params["id"];

                // Find scout by id
                let repo = getEntityManager().getRepository(Scout);
                let scout = await repo.findOneById(id);

                // Make sure the scout exists
                if (!scout) {
                    return reply(Boom.badRequest("Scout does not exist"));
                }

                // Update scout                
                scout.name = request.payload.name;
                scout.rank = request.payload.rank;
                repo.persist(scout);

                reply(scout);
            },
            validate: {
                headers: JWT.jwtValidator,
                params: {
                    id: Joi.string().required()
                },
                payload: Joi.object().keys({
                    name: Joi.string().required(),
                    rank: Joi.string().required()
                })
            },
            tags: ['api', 'scouts'],
            description: 'Update a scout'
        }
    });

    // DELETE: /scouts/{id}
    server.route({
        method: 'DELETE',
        path: '/scouts/{id}',
        config: {
            auth: 'jwt',
            handler: async (request: Hapi.Request, reply: Hapi.ReplyNoContinue) => {

                let id = request.params["id"];

                // Find scout by id
                let repo = getEntityManager().getRepository(Scout);
                let scout = await repo.findOneById(id);

                // Make sure the scout exists
                if (!scout) {
                    return reply(Boom.badRequest("Scout does not exist"));
                }

                // Bye!
                await repo.remove(scout);

                reply();
            },
            validate: {
                headers: JWT.jwtValidator,
                params: {
                    id: Joi.string().required()
                },
            },
            tags: ['api', 'scouts'],
            description: 'Delete scout by id'
        }
    });

}