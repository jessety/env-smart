// import env from 'env-smart';
import env from '../../';

export type Configuration = {
  host: string;
  port: number;
  verbose: boolean;
};

export const config = env.config<Configuration>((env) => {
  // `env` is now populated from the .env file, process config, and defaults
  return {
    host: env.HOST,
    port: env.PORT,
    verbose: env.VERBOSE,
  };
});

// `config` is now a fully typed config file fully populated via the `.env` file and the process env

console.log(
  `Host: ${config.host} port: ${config.port} verbose: ${config.verbose} `,
);
console.dir(config);
