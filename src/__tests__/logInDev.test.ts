import { describe, it, expect, vi } from 'vitest';
import { logInDev } from '@/utils/logInDev';

describe('logInDev', () => {
  it('should log the message when VITE_STAGE is dev', () => {
    import.meta.env.VITE_STAGE = 'dev';
    const consoleLogSpy = vi.spyOn(console, 'log');

    const message = 'This is a test log';
    logInDev(message);

    expect(consoleLogSpy).toHaveBeenCalledWith(message);
    consoleLogSpy.mockRestore();
  });

  it('should not log the message when VITE_STAGE is not dev', () => {
    import.meta.env.VITE_STAGE = 'production';
    const consoleLogSpy = vi.spyOn(console, 'log');

    const message = 'This is a test log';
    logInDev(message);

    expect(consoleLogSpy).not.toHaveBeenCalled();

    consoleLogSpy.mockRestore();
  });
});