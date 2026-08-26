/** Return `false` (sync or Promise) to cancel the action. Other values proceed. */
export type AsyncGuard<T extends unknown[] = []> = (
  ...args: T
) => unknown | Promise<unknown>

export async function allowAfterGuard<T extends unknown[]>(
  guard: AsyncGuard<T> | undefined,
  ...args: T
): Promise<boolean> {
  if (!guard) return true
  const result = await guard(...args)
  return result !== false
}
