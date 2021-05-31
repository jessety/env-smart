import os from 'os';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

import { load } from '../';

describe('load function', () => {

  const directory = path.resolve(os.tmpdir(), '.env_smart_test_load');

  const createFile = (filename: string, contents: string) => {
    const data = Buffer.from(contents);
    const filePath = path.join(directory, filename);
    return promisify(fs.writeFile)(filePath, data);
  };

  beforeAll(async () => {

    if (fs.existsSync(directory) === false) {
      await promisify(fs.mkdir)(directory, { recursive: true });
    }

    await createFile('.env', `
    TEST=true
    ITEMS=[4,5,6]
    additional=yes
    ENVSMART=boolean=true`);

    await createFile('.env.defaults', `
    TEST=false
    PORT=2112
    ITEMS=[1,2,3]
    DEFAULTSCANTYPE=boolean=true`);

    await createFile('.env.types', `
    TEST=boolean
    PORT=number
    ITEMS=array
    NOT_FOUND=boolean`);
  });

  test('loads files', async () => {

    const env = load({ directory, replace: false });

    expect(env.TEST).toBe(true);
    expect(env.PORT).toBe(2112);
    expect(env.ITEMS).toEqual([4, 5, 6]);
    expect(env.DEFAULTSCANTYPE).toBe(true);
    expect(env.ENVSMART).toBe(true);
  });

  test('uses alternate filenames when specified', async () => {

    await createFile('.alternate_env', `
    alternate=true`);

    await createFile('.alternate_env_defaults', `
    alternate=false
    another=boolean=true`);

    await createFile('.alternate_env_types', `
    alternate=boolean`);

    const env = load({
      directory,
      replace: false,
      envFilename: '.alternate_env',
      envDefaultsFilename: '.alternate_env_defaults',
      envTypesFilename: '.alternate_env_types'
    });

    expect(env.alternate).toBe(true);
    expect(env.another).toBe(true);
  });

  test('loads all env keys as lower case when specified', async () => {

    const env = load({ directory, replace: false, lowercase: true });

    expect(env.test).toBe(true);
  });

  test('loads all env keys as upper case when specified', async () => {

    const env = load({ directory, replace: false, uppercase: true });

    expect(env.ADDITIONAL).toBe('yes');
  });

  test('loads null for empty values when specified', async () => {

    const envFileName = '.somenulls.env';
    await createFile(envFileName, 'TEST0=abc123');

    const typesFileName = '.somenulls.env.types';
    await createFile(typesFileName, `
    TEST1=string
    TEST2=boolean
    TEST3=number
    TEST4=object
    TEST4=array
    `);

    const env = load({
      replace: false,
      directory,
      missingValues: 'null',
      envFilename: envFileName,
      envTypesFilename: typesFileName
    });

    expect(env.TEST0).toBe('abc123');
    expect(env.TEST1).toBeNull();
    expect(env.TEST2).toBeNull();
    expect(env.TEST3).toBeNull();
    expect(env.TEST4).toBeNull();
    expect(env.TEST5).toBeNull();
    expect(env.TEST6).toBeUndefined();

    await promisify(fs.unlink)(path.join(directory, envFileName));
    await promisify(fs.unlink)(path.join(directory, typesFileName));
  });

  test('loads in process.cwd and replaces the process env by default', async () => {

    const filepath = path.join(process.cwd(), '.env');

    await promisify(fs.writeFile)(filepath, Buffer.from('ENVSMART_IN_CWD=boolean=true'));

    load();

    expect(process.env.ENVSMART_IN_CWD).toBe(true);

    await promisify(fs.unlink)(filepath);
  });

  afterAll(() => {

    // Delete the test folder and everything in it
    return promisify(fs.rmdir)(directory, { recursive: true });
  });
});
