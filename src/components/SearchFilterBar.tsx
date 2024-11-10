import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { SearchFilterBarProps } from '../interface/Interface';
import useDebounce from './UseDebounce';
import constant from '../utils/constant';
import Image from 'next/image';

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
    searchParams,
    handleSearchChange,
    uniquePrepTimes,
    uniqueCookTimes,
    placeholder
}) => {
    const [activeDropdown, setActiveDropdown] = useState<string>('');
    const router = useRouter();
    const [query, setQuery] = useState<string>(searchParams.query as string);
    const debouncedQuery = useDebounce(query, 600);

    useEffect(() => {
        if (debouncedQuery.length >= 3 || debouncedQuery.length === 0) {
            handleSearchChange({ target: { name: 'query', value: debouncedQuery } });
        }
    }, [debouncedQuery, handleSearchChange]);

    const filters = [
        {
            icon: constant.imageLink.ratingsIcon,
            label: constant.label.rating,
            dropdownKey: constant.dropdownKeys.rating,
            dropdownItems: [1, 2, 3, 4, 5]
        },
        {
            icon: constant.imageLink.prepTimeIcon,
            label: constant.label.prepationTime,
            dropdownKey: constant.dropdownKeys.prepTime,
            dropdownItems: uniquePrepTimes
        },
        {
            icon: constant.imageLink.cookTimeIcon,
            label: constant.label.cookingTime,
            dropdownKey: constant.dropdownKeys.cookTime,
            dropdownItems: uniqueCookTimes
        }
    ];

    const shouldShowFilters = [
        constant.routes.myRecipe,
        constant.routes.myFavo,
        constant.routes.recipes
    ].includes(router.pathname);

    const handleDropdownSelect = (filterKey: string, value: string | number) => {
        handleSearchChange({ target: { name: filterKey, value } });
        setActiveDropdown('');
    };

    const handleRemoveFilter = (filterKey: string) => {
        handleSearchChange({ target: { name: filterKey, value: '' } });
    };

    return (
        <div className='flex flex-wrap p-3 gap-3 mt-0 w-full items-start'>
            <div className='flex w-full justify-center mx-auto mt-4 search-bar-container'>
                <form className='flex w-full items-center h-12 rounded-lg'>
                    <input
                        type='text'
                        name='query'
                        className='flex-1 rounded-lg bg-[#f5f0e5] text-[#a1824a] h-full p-2 pl-4 font-medium text-lg'
                        placeholder={placeholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </form>
            </div>

            {shouldShowFilters && (
                <div className='flex w-full gap-3 justify-center flex-wrap py-2 z-10 filter-container'>
                    {filters.map((filter, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                            <button
                                className={`flex items-center justify-center min-h-8 px-2 rounded-full bg-[#f5f0e5] border-none cursor-pointer text-[#1c170d] font-medium text-sm ${searchParams[filter.dropdownKey] ? 'bg-[#d3f9d8] border-[#36c48a]' : ''}`}
                                onClick={() => setActiveDropdown(activeDropdown === filter.dropdownKey ? '' : filter.dropdownKey)}
                            >
                                <Image src={filter.icon} alt={filter.label} width={20} height={20} />
                                <span>{searchParams[filter.dropdownKey] ? `${filter.label}: ${searchParams[filter.dropdownKey]}` : filter.label}</span>
                                <Image src={constant.imageLink.dropdownIcon} alt={constant.imageAlt.dropdown} width={20} height={20} />
                            </button>

                            {activeDropdown === filter.dropdownKey && (
                                <div className='absolute bg-white border border-gray-300 rounded-lg p-2 flex flex-col w-full z-20 shadow-lg'> {/* Increased z-index */}
                                    {filter.dropdownItems.map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleDropdownSelect(filter.dropdownKey, item)}
                                            className='bg-transparent border-none p-2 text-left text-gray-800 font-normal text-sm w-full hover:bg-[#f5f0e5]'
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className='flex gap-2 flex-wrap w-full mt-4 z-0 justify-center'>
                {filters.map((filter) => (
                    searchParams[filter.dropdownKey] && (
                        <div key={filter.dropdownKey} className='bg-[#e0ffe0] px-3 py-1 rounded-full flex items-center'>
                            {`${filter.label}: ${searchParams[filter.dropdownKey]}`}
                            <button onClick={() => handleRemoveFilter(filter.dropdownKey)} className='ml-2 bg-transparent border-none cursor-pointer text-red-600'>
                                &#10005;
                            </button>
                        </div>
                    )
                ))}
            </div>
            <style jsx>{`@media (max-width: 768px) { .search-bar-container { margin-top: 50px; } } `} </style>
        </div>
    );
};

export default SearchFilterBar;
