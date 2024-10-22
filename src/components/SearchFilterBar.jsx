import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../styles/SearchFilterBar.module.css';
import useDebounce from './UseDebounce';
import constant from '../utils/constant';

const SearchFilterBar = ({ searchParams, handleSearchChange, uniquePrepTimes, uniqueCookTimes, placeholder }) => {
    const [activeDropdown, setActiveDropdown] = useState('');
    const location = useLocation();
    const [query, setQuery] = useState(searchParams.query);
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

    const shouldShowFilters = [constant.routes.myRecipe, constant.routes.myFavo, constant.routes.recipes].includes(location.pathname);

    const handleDropdownSelect = (filterKey, value) => {
        handleSearchChange({ target: { name: filterKey, value } });
        setActiveDropdown('');
    };

    const handleRemoveFilter = (filterKey) => {
        handleSearchChange({ target: { name: filterKey, value: '' } });
    };

    return (
        <div className={styles.searchFilterContainer}>
            <div className={styles.searchWrapper}>
                <form className={styles.searchBar}>
                    <input
                        type='text'
                        name='query'
                        className={styles.searchInput}
                        placeholder={placeholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </form>
            </div>

            {shouldShowFilters && (
                <div className={styles.filterBar}>
                    {filters.map((filter, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                            <button
                                className={styles.filterButton}
                                onClick={() => setActiveDropdown(activeDropdown === filter.dropdownKey ? '' : filter.dropdownKey)}
                                style={{
                                    backgroundColor: searchParams[filter.dropdownKey] ? '#d3f9d8' : '',
                                    borderColor: searchParams[filter.dropdownKey] ? '#36c48a' : ''
                                }}
                            >
                                <img src={filter.icon} alt='' className={styles.filterIcon} />
                                <span>{searchParams[filter.dropdownKey] ? `${filter.label}: ${searchParams[filter.dropdownKey]}` : filter.label}</span>
                                <img src={constant.imageLink.dropdownIcon} alt={constant.imageAlt.dropdown} className={styles.arrowIcon} />
                            </button>

                            {activeDropdown === filter.dropdownKey && (
                                <div className={styles.dropdown}>
                                    {filter.dropdownItems.map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleDropdownSelect(filter.dropdownKey, item)}
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

            <div className={styles.selectedFilters}>
                {filters.map((filter) => (
                    searchParams[filter.dropdownKey] && (
                        <div key={filter.dropdownKey} className={styles.filterTag}>
                            {`${filter.label}: ${searchParams[filter.dropdownKey]}`}
                            <button onClick={() => handleRemoveFilter(filter.dropdownKey)} className={styles.removeFilterButton}>
                                &#10005;
                            </button>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default SearchFilterBar;
