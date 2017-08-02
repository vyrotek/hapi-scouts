import * as Hapi from "hapi";
import * as Joi from "joi";
import * as Jwt from "jsonwebtoken";
import * as Boom from "boom";
import { getEntityManager } from "typeorm";
import { IConfig } from "../configs";
import { User } from "./user";

export function register(server: Hapi.Server, config: IConfig) {

    // POST: /users/login
    server.route({
        method: 'POST',
        path: '/users/login',
        config: {
            handler: async (request: Hapi.Request, reply: Hapi.ReplyNoContinue) => {

                let email: string = request.payload.email;
                let password: string = request.payload.password;

                // Find user by email
                let repo = getEntityManager().getRepository(User);
                let user = await repo.findOne({ email: email });

                // Check user and password (For security reasons don't indicate which part is wrong)
                if (!user || !user.validatePassword(password)) {
                    return reply(Boom.unauthorized("Invalid credentials"));
                }

                // Generate signed jwt token
                let token = Jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: config.jwtExpiration });

                reply({
                    token: token
                });
            },
            validate: {
                payload: Joi.object().keys({
                    email: Joi.string().required(),
                    password: Joi.string().required()
                })
            },
            tags: ['api', 'users'],
            description: 'Get user auth token'
        }
    });
}