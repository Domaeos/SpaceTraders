import { describe, it, expect } from 'vitest';
import formatString from '@/utils/formatString';

describe('formatString', () => {
  it('should replace underscores with spaces and capitalize each word', () => {
    const input = 'hello_world';
    const expectedOutput = 'Hello World';
    expect(formatString(input)).toBe(expectedOutput);
  });

  it('should handle multiple underscores correctly', () => {
    const input = 'hello_world_this_is_a_test';
    const expectedOutput = 'Hello World This Is A Test';
    expect(formatString(input)).toBe(expectedOutput);
  });

  it('should trim leading and trailing spaces', () => {
    const input = '  hello_world  ';
    const expectedOutput = 'Hello World';
    expect(formatString(input)).toBe(expectedOutput);
  });

  it('should handle empty strings', () => {
    const input = '';
    const expectedOutput = '';
    expect(formatString(input)).toBe(expectedOutput);
  });

  it('should handle strings with no underscores', () => {
    const input = 'helloworld';
    const expectedOutput = 'Helloworld';
    expect(formatString(input)).toBe(expectedOutput);
  });

  it('should handle strings with multiple spaces', () => {
    const input = 'hello  world';
    const expectedOutput = 'Hello  World';
    expect(formatString(input)).toBe(expectedOutput);
  });
});