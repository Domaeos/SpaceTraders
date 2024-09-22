import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUsersFromStorage } from '@/utils/getUsersFromStorage';
import { IUser } from '@/Types/types';

describe('getUsersFromStorage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return an empty array if no users are stored', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    const result = getUsersFromStorage();
    expect(result).toEqual([]);
  });

  it('should return parsed users if users are stored', () => {
    const users: IUser[] = [{ symbol: "231a", factionName: 'faction' } as IUser];
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(users));
    const result = getUsersFromStorage();
    expect(result).toEqual(users);
  });
});
