import * as Hapi from "hapi";

export function register(server: Hapi.Server): Promise<void> {
    return new Promise<void>((resolve) => {
        server.register([require('inert'), require('vision'),
        {
            register: require('hapi-swagger'),
            options: {
                info: {
                    title: 'Scout API',
                    description: 'Scout API',
                    version: '1.0'
                },
                grouping: 'tags',
                tags: [
                    {
                        'name': 'scouts'
                    },
                    {
                        'name': 'users'
                    }
                ],
                swaggerUI: true,
                documentationPage: true,
                documentationPath: '/docs'
            }
        }
        ]
        , (error) => {
            if (error) {
                console.log(`Error - swagger plugin: ${error}`);
            }
            // OK!
            resolve();
        });
    });
}