interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  divClassName?: string;
  [key: string]: any;
}

export default function SearchBar({ searchTerm, divClassName = "", setSearchTerm, ...rest }: SearchBarProps) {

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className={divClassName}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search..."
        {...rest}
      />
    </div>
  );
}