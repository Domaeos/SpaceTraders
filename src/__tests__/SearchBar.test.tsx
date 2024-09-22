import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from '@/Components/SearchBar';

describe('SearchBar Component', () => {
  it('renders the input element', () => {
    render(<SearchBar searchTerm="" setSearchTerm={() => {}} />);
    const inputElement = screen.getByPlaceholderText('Search...');
    expect(inputElement).toBeInTheDocument();
  });

  it('displays the correct initial value', () => {
    render(<SearchBar searchTerm="initial value" setSearchTerm={() => {}} />);
    const inputElement = screen.getByPlaceholderText('Search...') as HTMLInputElement;
    expect(inputElement.value).toBe('initial value');
  });

  it('calls setSearchTerm on input change', () => {
    const setSearchTermMock = vi.fn();
    render(<SearchBar searchTerm="" setSearchTerm={setSearchTermMock} />);
    const inputElement = screen.getByPlaceholderText('Search...');

    fireEvent.change(inputElement, { target: { value: 'new value' } });
    expect(setSearchTermMock).toHaveBeenCalledWith('new value');
  });

  it('renders without crashing', () => {
    const { container } = render(<SearchBar searchTerm="" setSearchTerm={() => {}} />);
    expect(container).toBeInTheDocument();
  });

  it('input element has the correct type', () => {
    render(<SearchBar searchTerm="" setSearchTerm={() => {}} />);
    const inputElement = screen.getByPlaceholderText('Search...');
    expect(inputElement).toHaveAttribute('type', 'text');
  });

  it('input element has the correct placeholder', () => {
    render(<SearchBar searchTerm="" setSearchTerm={() => {}} />);
    const inputElement = screen.getByPlaceholderText('Search...');
    expect(inputElement).toHaveAttribute('placeholder', 'Search...');
  });

  it('input element is initially empty', () => {
    render(<SearchBar searchTerm="" setSearchTerm={() => {}} />);
    const inputElement = screen.getByPlaceholderText('Search...') as HTMLInputElement;
    expect(inputElement.value).toBe('');
  });

  it('does not call setSearchTerm on initial render', () => {
    const setSearchTermMock = vi.fn();
    render(<SearchBar searchTerm="" setSearchTerm={setSearchTermMock} />);
    expect(setSearchTermMock).not.toHaveBeenCalled();
  });
});