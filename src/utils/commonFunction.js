import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import constant from '../utils/constant';

const parseTimeString = (timeString) => {
    const [value, unit] = timeString.split(' ');
    return unit.includes('hour') ? parseInt(value) * 60 : parseInt(value);
};

const sortTimes = (times) => {
    return times.sort((a, b) => parseTimeString(a) - parseTimeString(b));
};

const handleModalClose = (setStatus, modalKey = 'showErrorModal', messageKey = 'errorMessage') => {
    setStatus((prevState) => ({
        ...prevState,
        [modalKey]: false,
        [messageKey]: '',
    }));
};

const handleInputChange = (e, setStatus, searchParamsKey = 'searchParams', resetKeys = { page: 1, recipes: [] }) => {
    const { name, value } = e.target;
    setStatus((prevState) => ({
        ...prevState,
        [searchParamsKey]: { ...prevState[searchParamsKey], [name]: value },
        page: 1,
        ...resetKeys,
    }));
};

const useClearLocalStorageAndRedirect = (redirectRoute) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname !== constant.routes.signIn) {
            localStorage.removeItem(constant.localStorageKeys.email);
            localStorage.removeItem(constant.localStorageKeys.txnId);
        }

        // Check if access and refresh tokens are available
        if (
            constant.localStorageUtils.getItem(constant.localStorageKeys.accessToken) &&
            constant.localStorageUtils.getItem(constant.localStorageKeys.refreshToken)
        ) {
            navigate(redirectRoute);
        }
    }, [navigate, redirectRoute, location.pathname]);
};

const useScrollPagination = (initialSearchParams, setStatus, fetchData, isLoading, totalPages, page, mainContentRef) => {
    const location = useLocation();

    // Reset search parameters and filters on pathname change
    useEffect(() => {
        setStatus((prev) => ({
            ...prev,
            searchParams: initialSearchParams,
            page: 1,
            recipes: [],
            allUniquePrepTimes: [],
            allUniqueCookTimes: [],
            notFound: false,
        }));
        window.scrollTo(0, 0);
    }, [location.pathname, initialSearchParams, setStatus]);

    // Fetch recipes when page or search params change
    useEffect(() => {
        fetchData();
    }, [page, fetchData]);

    // Handle infinite scrolling
    useEffect(() => {
        const handleScroll = () => {
            if (mainContentRef.current) {
                const bottom =
                    mainContentRef.current.scrollHeight -
                    mainContentRef.current.scrollTop <=
                    mainContentRef.current.clientHeight + 1;
                if (bottom && !isLoading && page < totalPages) {
                    setStatus((prev) => ({ ...prev, page: prev.page + 1 }));
                }
            }
        };

        const currentRef = mainContentRef.current;

        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, [isLoading, page, totalPages, mainContentRef, setStatus]);

    // Handle body overflow when modal is open
    useEffect(() => {
        document.body.style.overflow = constant.label.hidden;
        return () => {
            document.body.style.overflow = constant.label.auto;
        };
    }, []);
};

export {
    sortTimes,
    handleModalClose,
    handleInputChange,
    useScrollPagination,
    useClearLocalStorageAndRedirect
}
