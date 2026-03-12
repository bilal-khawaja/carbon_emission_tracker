import React from 'react';
import Layout from '../components/Layout';

const AboutPage = () => {
    return (
        <Layout>
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">About</h1>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600">About page with images coming soon...</p>
                </div>
            </div>
        </Layout>
    );
};

export default AboutPage;