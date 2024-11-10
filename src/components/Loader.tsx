import React from 'react';
import Image from 'next/image';
import constant from '../utils/constant';

const Loader: React.FC = () => {
    return (
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-transparent'>
            <Image
                src={constant.imageLink.loader}
                alt={constant.imageAlt.loading}
                className='w-12 h-12 md:w-8 md:h-8 lg:w-16 lg:h-16'
                width={64}
                height={64}
            />
        </div>
    );
};

export default Loader;
