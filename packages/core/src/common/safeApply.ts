
export const SafePromise =async function<T,E>(promise: Promise<T>): Promise<
  [T , null]|
  [null, E ]
> {
  const result: [any, any] = [null,null]
  try {
    result[0] = await promise
    return result as [T , null]
  } catch (e) {
    result[1] = e as E
    return result as [null, E ]
  }
}