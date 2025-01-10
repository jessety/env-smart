jest.mock('../src/load');
import { mocked } from 'jest-mock';
import { config } from '../src/index';
import { load } from '../src/load';

const loadMocked = mocked(load);

describe('config() function', () => {
  test(`properly returns typed env`, () => {
    loadMocked.mockReturnValue({
      PORT: 8080,
      HOST: 'api.example.com',
      VERBOSE: true
    });

    const typed = config<{
      host: string;
      port: number;
      verbose: boolean;
    }>((env) => {
      return {
        host: env.HOST,
        port: env.PORT,
        verbose: env.VERBOSE
      };
    });

    expect(typed.host).toBe('api.example.com');
    expect(typed.port).toBe(8080);
    expect(typed.verbose).toBe(true);
  });
});
