import { expect, test } from 'vitest';

test('validate test example', () => {
  expect(1 + 1).toBe(2);
});

test('array contains element', () => {
  expect([1, 2, 3]).toContain(2);
});

test('array length', () => {
  expect([1, 2, 3, 4]).toHaveLength(4);
});

test('value is truthy', () => {
  expect(true).toBeTruthy();
});

test('value is falsy', () => {
  expect(0).toBeFalsy();
});

test('number is less than', () => {
  expect(3).toBeLessThan(5);
});

test('object does not have property', () => {
  expect({ a: 1, b: 2 }).not.toHaveProperty('c');
});

test('string does not match regex', () => {
  expect('vitest').not.toMatch(/jest/);
});

test('value is not null', () => {
  expect('not null').not.toBeNull();
});

test('value is not undefined', () => {
  expect(42).not.toBeUndefined();
});
