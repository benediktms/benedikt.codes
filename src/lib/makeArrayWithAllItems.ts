type UnionArr<T, U extends T[]> = U &
  ([T] extends [U[number]] ? unknown : "Invalid value");

/**
 * Ensure that the resulting array has all possible options of T in it
 *
 * @returns an array with all members of the union over `T`
 * @example
 * ```
 * type Union = 'foo' | 'bar'
 * makeArrayWithAllItems<Union>() // ['foo', 'bar']
 *
 * ```
 */
export function makeArrayWithAllItems<T>() {
  return function <U extends T[]>(array: UnionArr<T, U>): UnionArr<T, U> {
    return array;
  };
}
