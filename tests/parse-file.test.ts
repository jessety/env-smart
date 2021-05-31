import os from 'os';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

import { parseFile } from '../src';

describe('parseFile function', () => {

  const directory = path.resolve(os.tmpdir(), '.env_smart_test_parseFile');

  const createFile = (fileName: string, contents: string) => {
    const data = Buffer.from(contents);
    const filePath = path.join(directory, fileName);
    return promisify(fs.writeFile)(filePath, data);
  };

  beforeAll(() => {

    if (fs.existsSync(directory) === false) {
      return promisify(fs.mkdir)(directory, { recursive: true });
    }
  });

  test(`parses valid files`, async () => {

    const filename = 'valid.env';

    await createFile(filename,
      `TEST=TRUE
    BOOLEAN=boolean=true
    integer=number=42
    string=abc123`);

    const result = parseFile(path.join(directory, filename)) as {[key: string]: unknown};

    expect(result).not.toBeUndefined();
    expect(result.TEST).toBe('TRUE');
    expect(result.BOOLEAN).toBe(true);
    expect(result.integer).toBe(42);
  });

  test(`handles parsing non-existent files`, async () => {

    const spy = jest.spyOn(console, 'warn').mockImplementation();

    const result = parseFile(path.join(directory, 'doesnotexist.env'), { verbose: true });

    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();

    expect(result).toBeUndefined();
  });

  test(`handles parsing empty files`, async () => {

    const filename = 'empty.env';

    await createFile(filename, '');

    const spy = jest.spyOn(console, 'warn').mockImplementation();

    const result = parseFile(path.join(directory, filename), { verbose: true });

    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();

    expect(result).toBeUndefined();
  });

  afterAll(() => {

    // Delete the test folder and everything in it
    return promisify(fs.rmdir)(directory, { recursive: true });
  });
});
