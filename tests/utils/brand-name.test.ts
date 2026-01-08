import { describe, it, expect } from 'vitest';
import { projectNameToBrandName } from '../../src/utils/brand-name.js';

describe('projectNameToBrandName', () => {
  it('should convert kebab-case to Title Case', () => {
    expect(projectNameToBrandName('my-awesome-app')).toBe('My Awesome App');
  });

  it('should handle single word', () => {
    expect(projectNameToBrandName('myapp')).toBe('Myapp');
  });

  it('should handle multiple words', () => {
    expect(projectNameToBrandName('my-super-awesome-app')).toBe('My Super Awesome App');
  });

  it('should handle single character words', () => {
    expect(projectNameToBrandName('a-b-c')).toBe('A B C');
  });

  it('should handle numbers in project name', () => {
    expect(projectNameToBrandName('app-123')).toBe('App 123');
  });

  it('should handle project name with numbers at start', () => {
    expect(projectNameToBrandName('123-app')).toBe('123 App');
  });

  it('should handle empty string', () => {
    expect(projectNameToBrandName('')).toBe('');
  });

  it('should handle project name with no hyphens', () => {
    expect(projectNameToBrandName('myapp')).toBe('Myapp');
  });
});
