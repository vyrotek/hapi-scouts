import * as Hapi from "hapi";
import * as Joi from "joi";
import { IConfig } from "./configs";
import { User } from "./users/user";
import { getEntityManager } from "typeorm";

export function register(server: Hapi.Server, config: IConfig): Promise<void> {
    return new Promise<void>((resolve) => {
        server.register({
            register: require('hapi-auth-jwt2')
        }, (error) => {
            if (error) {
                console.log(`Error - jwt plugin: ${error}`);
            } else {
                server.auth.strategy('jwt', 'jwt', false, {
                    key: config.jwtSecret,
                    verifyOptions: { algorithms: ['HS256'] },
                    validateFunc: async (decoded: any, request: any, cb: any) => {
                        // Look up user by id
                        let user = await getEntityManager().getRepository(User).findOneById(decoded.id);
                        return cb(null, user != null);
                    }
                });
            }

            resolve();
        });
    });
};

export const jwtValidator = Joi.object({'authorization': Joi.string().required()}).unknown();