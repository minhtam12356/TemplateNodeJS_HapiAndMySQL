/*
const AppConfig = require('../config/app');

const manifest = {
  server: {},
  connections: [
    {
      router: {
        isCaseSensitive: false,
        stripTrailingSlash: true
      },
      port: process.env.PORT || 5001,
      routes: {
        cors: true
      }
    }
  ],
  registrations: [
    {
      plugin: {
        register: 'hapi-auth-jwt',
        options: AppConfig.jwt.options
      }
    }
  ]
};

if (AppConfig.documentation.enable) {
  manifest.registrations.push({
    plugin: {
      register: 'hapi-swagger',
      options: AppConfig.documentation.options
    }
  });

  if (
    AppConfig.documentation.options.documentationPage ||
    AppConfig.documentation.options.swaggerUI
  ) {
    manifest.registrations.push(
      {
        plugin: {
          register: 'inert',
          options: {}
        }
      },
      {
        plugin: {
          register: 'vision',
          options: {}
        }
      }
    );
  }
}

if (AppConfig.logging.console.enable || AppConfig.logging.loggly.enable) {
  const loggingPlugins = {
    plugin: {
      register: 'good',
      options: {
        reporters: {}
      }
    }
  };

  if (AppConfig.logging.console.enable) {
    loggingPlugins.plugin.options.reporters.consoleReporter = [
      {
        module: 'good-squeeze',
        name: 'Squeeze',
        args: AppConfig.logging.console.levels
      },
      {
        module: 'good-console'
      },
      'stdout'
    ];
  }

  if (AppConfig.logging.loggly.enable) {
    loggingPlugins.plugin.options.reporters.logglyReporter = [
      {
        module: 'good-squeeze',
        name: 'Squeeze',
        args: AppConfig.logging.loggly.levels
      },
      {
        module: 'good-loggly',
        args: [
          {
            token: AppConfig.logging.loggly.token,
            subdomain: AppConfig.logging.loggly.subdomain,
            tags: AppConfig.logging.loggly.tags,
            name: AppConfig.logging.loggly.name,
            hostname: AppConfig.logging.loggly.hostname,
            threshold: AppConfig.logging.loggly.threshold,
            maxDelay: AppConfig.logging.loggly.maxDelay
          }
        ]
      }
    ];
  }

  manifest.registrations.push(loggingPlugins);
}

module.exports = manifest;
*/

const Dotenv = require('dotenv');
const Confidence = require('@makeomatic/confidence');
const Toys = require('toys');
const Schwifty = require('schwifty');
const Package = require('../package.json');
const AppConfig = require('./app');

// Pull .env into process.env
Dotenv.config({ path: `${__dirname}/../.env` });

// Glue manifest as a confidence store
module.exports = new Confidence.Store({
  server: {
    host: 'localhost',
    port: {
      $env: 'PORT',
      $coerce: 'number',
      $default: 3000
    },
    debug: {
      $filter: { $env: 'NODE_ENV' },
      $default: {
        log: ['error'],
        request: ['error']
      },
      production: {
        request: ['implementation']
      }
    }
  },
  register: {
    plugins: [
      /*      {
        plugin: '../lib', // Main plugin
        options: {}
      }, */
      // Static file and directory handlers
      {
        plugin: '@hapi/inert'
      },
      {
        plugin: '@hapi/vision'
      },

      // Swagger support
      {
        plugin: 'hapi-swagger',
        options: {
          info: {
            version: Package.version,
            description: 'A NodeJS API Template with Hapi and mysql'
          },
          securityDefinitions: {
            Bearer: {
              type: 'apiKey',
              name: 'Authorization',
              in: 'header'
            }
          },
          security: [{ jwt: [] }]
        }
      },
      {
        plugin: 'schwifty',
        options: {
          $filter: 'NODE_ENV',
          $default: {},
          $base: {
            migrateOnStart: true,
            knex: {
              client: 'mysql',
              connection: {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
              },
              pool: { min: 0, max: 10 },
              migrations: {
                stub: Schwifty.migrationsStubPath
              }
            }
          },
          production: {
            migrateOnStart: false
          }
        }
      },
      //* *************************************************************
      //                                                             *
      //                      API PLUGINS                            *
      //                                                             *
      //* *************************************************************
      // API Route, Models and Service
      {
        plugin: './plugin/apiRoute'
      },
      // JWT authentication
      {
        plugin: 'hapi-auth-jwt2'
      },
      //  JWT-Authentication strategy
      {
        plugin: './plugin/jwtAuth',
        options: AppConfig.jwt
      },
      {
        plugin: {
          $filter: { $env: 'NODE_ENV' },
          $default: 'hpal-debug',
          production: Toys.noop
        }
      },
      {
        plugin: './plugin/responseFormatter'
      }
    ]
  }
});
