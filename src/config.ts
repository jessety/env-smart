/* eslint-disable @typescript-eslint/no-explicit-any */
import { load, loadOptions } from './load';

/**
 * Return structured, typed configuration information from both the process ENV and a .env file
 * Takes in a transform function that populates a configuration type
 */
export function config<T>(
  transform: (env: { [key: string]: any }) => T,
  options?: loadOptions,
): T {
  // Load the contents of the `.env` file and the process env
  const env = load(options);

  // Transform the env into the config type
  return <T>transform(env);
}
