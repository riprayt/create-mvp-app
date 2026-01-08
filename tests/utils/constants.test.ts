import { describe, it, expect } from 'vitest';
import { SHADCN_BLOCKS } from '../../src/utils/constants.js';

describe('SHADCN_BLOCKS', () => {
  it('should be an array', () => {
    expect(Array.isArray(SHADCN_BLOCKS)).toBe(true);
  });

  it('should contain multiple blocks', () => {
    expect(SHADCN_BLOCKS.length).toBeGreaterThan(0);
  });

  it('should contain expected blocks', () => {
    expect(SHADCN_BLOCKS).toContain('navbar1');
    expect(SHADCN_BLOCKS).toContain('hero3');
    expect(SHADCN_BLOCKS).toContain('footer2');
    expect(SHADCN_BLOCKS).toContain('feature13');
  });

  it('should have all strings as block names', () => {
    SHADCN_BLOCKS.forEach(block => {
      expect(typeof block).toBe('string');
      expect(block.length).toBeGreaterThan(0);
    });
  });

  it('should not have duplicate blocks', () => {
    const uniqueBlocks = new Set(SHADCN_BLOCKS);
    expect(uniqueBlocks.size).toBe(SHADCN_BLOCKS.length);
  });
});
