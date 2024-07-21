// @ts-expect-error TS incorrectly doesn't detect this
/** @type {import('ts-jest').JestConfigWithTsJest} */

// eslint-disable-next-line no-undef
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
}
