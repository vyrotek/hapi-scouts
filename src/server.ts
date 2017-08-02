import * as Hapi from "hapi";
import * as Config from "./configs";
import * as Swagger from "./swagger";
import * as JWT from "./jwt";
import * as Users from "./users/routes";
import * as Scouts from "./scouts/routes";
import { createConnection } from "typeorm";

// Load config settings
var config = Config.getConfig();

// Init Hapi
const port = process.env.PORT || config.port;
const server = new Hapi.Server();
server.connection({
    port: port,
    routes: {
        cors: true
    }
});

// Add /api prefix
if (config.routePrefix) {
    server.realm.modifiers.route.prefix = config.routePrefix;
}

// Initialize DB connection
createConnection().then(async (connection) => {
    console.log('DB connected')
}).catch(error => {
    console.log('DB connection error: ', error)
});

// Register plugins
let plugins = [];
plugins.push(Swagger.register(server));
plugins.push(JWT.register(server, config));

// After plugins are registered start server
Promise.all(plugins).then(() => {

    // Register routes
    console.log('Registering Routes...');
    Users.register(server, config);
    Scouts.register(server, config);

    // Start
    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log(`Server running at: ${server.info.uri}`);
    });
});