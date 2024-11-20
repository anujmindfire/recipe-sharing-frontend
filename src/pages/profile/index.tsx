import React from 'react';
import Sidebar from '../../components/Sidebar';
import { ProfileLayoutProps } from '../../types/types';
import { Layout } from 'antd';

const { Content } = Layout;

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
    return (
        <Layout className='min-h-screen bg-gray-900'>
            <div className='flex w-full'>
                <Sidebar />
                <Content className='flex-grow relative p-6'>
                    <section className='overflow-y-auto max-h-[calc(100vh-30px)] p-4 bg-gray-900'>
                        {children}
                    </section>
                </Content>
            </div>
        </Layout>
    );
};

export default ProfileLayout;