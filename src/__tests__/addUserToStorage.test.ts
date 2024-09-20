import { describe, it, expect, vi, beforeEach } from "vitest";
import { addUserToStorage } from "@/utils/addUserToStorage";
import * as storageModule from "@/utils/getUsersFromStorage"; // Import the entire module
import { IUser } from "@/Types/types";

const mockUser: IUser = {
  accountId: "1",
  symbol: "TEST_SYMBOL",
  token: "test_token",
  factionName: "Test Faction",
};

describe("addUserToStorage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should add a new user to an empty localStorage", () => {
    vi.spyOn(storageModule, 'getUsersFromStorage').mockReturnValue([]);

    addUserToStorage(mockUser);

    const storedData = JSON.parse(localStorage.getItem("users") || "[]");
    expect(storedData).toEqual([mockUser]);
  });

  it("should append a new user to existing users in localStorage", () => {
    const existingUsers: IUser[] = [
      {
        accountId: "2",
        symbol: "EXISTING_SYMBOL",
        token: "existing_token",
        factionName: "Existing Faction"
      },
    ];

    vi.spyOn(storageModule, 'getUsersFromStorage').mockReturnValue(existingUsers);

    addUserToStorage(mockUser);

    const storedData = JSON.parse(localStorage.getItem("users") || "[]");
    expect(storedData).toEqual([...existingUsers, mockUser]);
  });

  it("should call getUsersFromStorage once", () => {
    vi.spyOn(storageModule, 'getUsersFromStorage').mockReturnValue([]);

    addUserToStorage(mockUser);

    expect(storageModule.getUsersFromStorage).toHaveBeenCalledTimes(1);
  });
});
