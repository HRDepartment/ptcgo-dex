export const SERIALIZE_PREFIX = `___$$__`;
export const SERIALIZE_PREFIX_REGEX = /___\$\$__/g;
/**
 * If sorter is undefined, this function sorts by key.
 *
 * This function adds an __$i prefix in front of numeric keys, so V8 does not break the sort order.
 * writeJSON in io.ts will automatically remove these after serializing to JSON.
 * It's an unfortunate hack.
 *
 * Only use this function for objects you intend to pass to writeJSON (such as in toJSON methods)
 */
export function sortObjectForSerialize(
  object: any,
  sorter?: (valueA: any, valueB: any) => number
) {
  const sorted: any = {};
  const sortOrder = Object.keys(object).sort(
    sorter ? (a, b) => sorter(object[a], object[b]) : undefined
  );

  for (const key of sortOrder) {
    if (Number.isNaN(Number(key))) {
      sorted[key] = object[key];
    } else {
      sorted[SERIALIZE_PREFIX + key] = object[key];
    }
  }

  return sorted;
}

/** For issues that must be addressed before a new release can be shipped (such as new attributes or new game mechanics) */
export function fatal(...log: any[]) {
  console.error(...log);
  return new Error('Fatal Error encountered. Refer to the logs.');
}

/** Clear messages using InconsistencyLog.length = 0 */
export const InconsistencyLog: any[][] = [];
/** Inconsistency inside the game's schema. Can sometimes point to bugs */
export function inconsistency(...log: any[]) {
  console.info(`PTCGO Inconsistency:`, ...log);
  InconsistencyLog.push(log);
}
