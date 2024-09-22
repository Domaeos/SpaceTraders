import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import NewGame from "@/Components/NewGame";
import fetchFactions from "@/API/fetchFactions";
import registerUser from "@/API/registerUser";
import { UserContext } from "@/Contexts/UserContext";
import toast from "react-hot-toast";
import { IFaction, IUser } from "@/Types/types";
import '@testing-library/jest-dom';

vi.mock("../API/fetchFactions");
vi.mock("../API/registerUser");

vi.mock("react-hot-toast");

describe("NewGame component", () => {
    const mockSetUser = vi.fn();
    const mockFactions: IFaction[] = [
        { symbol: "COSMIC", name: "Cosmic League", description: "Fake", headquarters: "None" },
        { symbol: "GALACTIC", name: "Galactic Federation", description: "Fake", headquarters: "None" },
    ];

    beforeEach(() => {
        vi.clearAllMocks();

        (fetchFactions as vi.Mock).mockResolvedValue({
            data: { data: mockFactions },
        });

        (registerUser as vi.Mock).mockResolvedValue({
            data: { id: 1, symbol: "NewUser" },
        });

        (toast.success as vi.Mock).mockImplementation(() => {});
        (toast.error as vi.Mock).mockImplementation(() => {});
    });

    it("renders the form and fetches factions", async () => {
        render(
            <UserContext.Provider value={{ user: {} as IUser, setUser: mockSetUser }}>
                <NewGame />
            </UserContext.Provider>
        );

        expect(screen.getByLabelText(/Symbol/i)).toBeInTheDocument();

        await waitFor(() =>
            expect(screen.getByLabelText(/Choose a faction/i)).toBeInTheDocument()
        );

        mockFactions.forEach((faction) => {
            expect(screen.getByText(faction.name)).toBeInTheDocument();
        });
    });

    it("validates symbol length and prevents form submission", async () => {
        render(
            <UserContext.Provider value={{ user: {} as IUser, setUser: mockSetUser }}>
                <NewGame />
            </UserContext.Provider>
        );

        act(() => {
            fireEvent.change(screen.getByLabelText(/Symbol/i), {
                target: { value: "Abc" },
            });
            fireEvent.submit(screen.getByRole("button", { name: /Register/i }));
        })

        expect(
            screen.getByText(/Please enter a name for your character/i)
        ).toBeInTheDocument();
    });
});
