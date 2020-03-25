import { promises as fs } from 'fs';
import { SERIALIZE_PREFIX_REGEX } from './util';

export async function writeJSON(file: string, json: any) {
  return fs.writeFile(
    `./${file}`,
    JSON.stringify(json, null, 2).replace(SERIALIZE_PREFIX_REGEX, '')
  );
}

export async function writeLog(file: string, log: any[][]) {
  return fs.writeFile(
    `./${file}`,
    log
      .map(line =>
        line
          .map(message =>
            typeof message === 'object' ? require('util').inspect(message) : message
          )
          .join(' ')
      )
      .join('\n')
  );
}
