/**
 * Name-path utilities for nested form fields.
 *
 * A field name can be written as a string (`'user.name'`, `'items[0].title'`),
 * a single key, or an explicit array (`['items', index, 'title']`).
 */

export type NamePathKey = string | number
export type NamePath = NamePathKey | NamePathKey[]

const PATH_SEGMENT = /[^.[\]]+/g

/** Normalize any supported name form into an explicit key array. */
export function toPath(name: NamePath): NamePathKey[] {
  if (Array.isArray(name)) return [...name]
  if (typeof name === 'number') return [name]

  const segments = name.match(PATH_SEGMENT)
  if (!segments) return name === '' ? [] : [name]

  return segments.map((segment) => {
    const numeric = Number(segment)
    return Number.isInteger(numeric) && String(numeric) === segment ? numeric : segment
  })
}

/** Canonical string form of a path, used as the registration / error key. */
export function pathKey(path: NamePathKey[]): string {
  let key = ''
  for (const segment of path) {
    if (typeof segment === 'number') key += `[${segment}]`
    else key += key === '' ? segment : `.${segment}`
  }
  return key
}

/** Name (any supported form) → canonical key. */
export function toKey(name: NamePath): string {
  return pathKey(toPath(name))
}

export function getPathValue(target: unknown, path: NamePathKey[]): unknown {
  let current: unknown = target
  for (const key of path) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as Record<NamePathKey, unknown>)[key]
  }
  return current
}

/** Write a value at `path`, creating intermediate objects / arrays as needed. */
export function setPathValue(
  target: Record<NamePathKey, any>,
  path: NamePathKey[],
  value: unknown,
): void {
  if (path.length === 0) return

  let current = target
  for (let index = 0; index < path.length - 1; index += 1) {
    const key = path[index]
    const nextKey = path[index + 1]
    if (key === undefined || nextKey === undefined) break

    if (current[key] == null || typeof current[key] !== 'object') {
      current[key] = typeof nextKey === 'number' ? [] : {}
    }
    current = current[key]
  }

  const last = path[path.length - 1]
  if (last !== undefined) current[last] = value
}

/** Remove the value at `path`. Missing intermediates are ignored. */
export function deletePathValue(
  target: Record<NamePathKey, any>,
  path: NamePathKey[],
): void {
  if (path.length === 0) return

  const parent = getPathValue(target, path.slice(0, -1))
  if (parent == null || typeof parent !== 'object') return

  const last = path[path.length - 1]
  if (last === undefined) return
  if (Array.isArray(parent) && typeof last === 'number') parent.splice(last, 1)
  else delete (parent as Record<NamePathKey, unknown>)[last]
}

/** True when `candidate`'s path starts with `prefix` (either direction of containment). */
export function pathContains(
  candidate: NamePathKey[],
  prefix: NamePathKey[],
): boolean {
  if (candidate.length < prefix.length) return false
  return prefix.every((segment, index) => candidate[index] === segment)
}
