import { describe, it, expect } from 'vitest';
import convertBooleanToYesOrNo from "@/utils/convertBooleanToYesOrNo"

describe('convertBooleanToYesOrNo', () => {
  it('should return "Yes" for true', () => {
    const result = convertBooleanToYesOrNo(true);
    expect(result).toBe('Yes');
  });

  it('should return "No" for false', () => {
    const result = convertBooleanToYesOrNo(false);
    expect(result).toBe('No');
  });
});