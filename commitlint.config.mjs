/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert', 'release'],
    ],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    // Allow Chinese / longer subjects
    'subject-case': [0],
    'header-max-length': [2, 'always', 120],
  },
}
