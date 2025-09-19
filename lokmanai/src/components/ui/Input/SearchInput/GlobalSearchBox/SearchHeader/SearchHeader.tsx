import React from 'react';

interface SearchHeaderProps {
    name: string;
}

const SearchHeader = ({ name }: SearchHeaderProps) => {
    return (
        <div className="text-general-search-headers text-primary-300">
            {name}
        </div>
    );
};

export default SearchHeader;
