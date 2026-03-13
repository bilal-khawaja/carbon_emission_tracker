import React from 'react';
import Layout from '../components/Layout';
import bgImage from '../assets/5f6cb232-d38f-4a43-b197-eaeb0ff2ef08.jpeg';
const AboutPage = () => {

    const headerStyle = {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: '50% 94%',
        backgroundAttachment: 'fixed',
        position: 'relative',
        margin: '-2rem -2rem 2rem -2rem',
        padding: '5rem 3rem 3rem 2rem',
        height: '160px',
        borderRadius: '0',
        overflow: 'hidden',
    };

    const headerOverlay = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 0,
    };

    const headerContent = {
        position: 'relative',
        zIndex: 1,
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div style={headerStyle}>
                    <div style={headerOverlay}></div>
                    <div style={headerContent} className="flex items-end justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white">About</h1>
                            <p className="text-green-100">Learn more about our carbon footprint tracking initiative</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className='text-2xl font-bold text-black mb-6 underline'>Vision</h1>
                    <p className="text-gray-600 mb-6"><span className="text-4xl text-gray-400 font-bold mr-2">❝</span>To be a leading Pakistani university driving excellence in learning, innovation and research.<span className="text-4xl text-gray-400 font-bold ml-2">❞</span></p>
                    <h1 className='text-2xl font-bold text-black mb-6 underline'>Mission</h1>
                    <p className="text-gray-600 mb-6"><span className="text-4xl text-gray-400 font-bold mr-2">❝</span>We are committed to transform the lives of our students, faculty, staff and alumni by providing an excellent learning
                        and research environment which ensures success in their personal and professional lives.
                        We believe in developing emotionally intelligent 'Superheroes' who can create social and economic
                        impact through an entrepreneurial mindset to build a Superior Pakistan.<span className="text-4xl text-gray-400 font-bold ml-2">❞</span></p>
                </div>
            </div>
        </Layout>
    );
};

export default AboutPage;