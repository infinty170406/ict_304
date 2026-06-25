import { describe, it, expect } from 'vitest';
import { API_BASE_URL } from '../utils/api';

describe('API Utils', () => {
  it('defines API_BASE_URL correctly', () => {
    expect(API_BASE_URL).toBeDefined();
    // It should be either a string or empty string
    expect(typeof API_BASE_URL).toBe('string');
  });
});
