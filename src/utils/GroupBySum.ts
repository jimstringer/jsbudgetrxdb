/**
 * Sums object value(s) in an array of objects, grouping by arbitrary object keys.
 *
 * @remarks
 * This method takes and returns an array of objects.
 * The resulting array of object contains a subset of the object keys in the
 * original array.
 *
 * @param arr - The array of objects to group by and sum.
 * @param groupByKeys - An array with the keys to group by.
 * @param sumKeys - An array with the keys to sum. The keys must refer
 *    to numeric values.
 * @returns An array of objects, grouped by groupByKeys and with the values
 *    of keys in sumKeys summed up.
 *
 * Thanks to: swimmer on stackoverflow
 * https://stackoverflow.com/questions/76272301/group-by-and-sum-on-multiple-keys-maintaining-type-safety/76272302#76272302
 */
export const groupBySum = <T, K extends keyof T, S extends keyof T>(
  arr: T[],
  groupByKeys: K[],
  sumKeys: S[]
): Pick<T, K | S>[] => {
  return [
    ...arr
      .reduce((accu, curr) => {
        const keyArr = groupByKeys.map((key) => curr[key]);
        const key = keyArr.join('-');
        const groupedSum =
          accu.get(key) ||
          Object.assign(
            {},
            Object.fromEntries(groupByKeys.map((key) => [key, curr[key]])),
            Object.fromEntries(sumKeys.map((key) => [key, 0]))
          );
        for (const key of sumKeys) {
          groupedSum[key] = groupedSum[key] + curr[key];
        }
        return accu.set(key, groupedSum);
      }, new Map())
      .values()
  ];
};
