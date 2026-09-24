import { describe, expect, it } from 'vitest'
import { formatSize, isImageFile, matchesAccept } from './fileUtils'

function file(name: string, type = '', content = 'x') {
  return new File([content], name, { type })
}

describe('fileUtils', () => {
  it('matchesAccept accepts extension, mime, and wildcard rules', () => {
    expect(matchesAccept(file('a.png', 'image/png'), '.png')).toBe(true)
    expect(matchesAccept(file('a.txt', 'text/plain'), '.png')).toBe(false)
    expect(matchesAccept(file('a.png', 'image/png'), 'image/png')).toBe(true)
    expect(matchesAccept(file('a.png', 'image/png'), 'image/*')).toBe(true)
    expect(matchesAccept(file('a.txt', 'text/plain'), 'image/*')).toBe(false)
    expect(matchesAccept(file('a.txt', 'text/plain'))).toBe(true)
  })

  it('isImageFile detects mime types and extensions', () => {
    expect(isImageFile({ name: 'photo.jpg', type: 'image/jpeg' })).toBe(true)
    expect(isImageFile({ name: 'badge.SVG', type: '' })).toBe(true)
    expect(isImageFile({ name: 'notes.txt', type: 'text/plain' })).toBe(false)
  })

  it('formatSize uses B, KB, and MB units', () => {
    expect(formatSize(12)).toBe('12 B')
    expect(formatSize(2048)).toBe('2 KB')
    expect(formatSize(1024 * 1024 * 1.5)).toBe('1.5 MB')
  })
})
