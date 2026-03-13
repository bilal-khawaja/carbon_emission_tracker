import React, { useState, useEffect } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import {
    Leaf,
    Zap,
    Car,
    FileText,
    Sun,
    Settings,
    TrendingUp,
    Calendar,
    BarChart,
    AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { dataAPI } from '../services/api';
import bgImage from '../assets/2e4f9049-0dc4-4feb-8d6e-771a9b778a9b.jpeg';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const DashboardPage = () => {
    const [viewMode, setViewMode] = useState('daily');
    const [todayData, setTodayData] = useState(null);
    const [weeklyData, setWeeklyData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const summary = await dataAPI.getDashboardSummary();

                const todayDataFromAPI = {
                    totalEmissions: summary.today_emissions,
                    breakdown: {
                        transport: summary.breakdown.transport,
                        energy: summary.breakdown.energy,
                        paper: summary.breakdown.paper,
                        generator: summary.breakdown.generator,
                        solarSavings: summary.breakdown.solar_savings
                    },
                    targets: summary.targets
                };

                const weeklyDataFromAPI = {
                    dates: summary.recent_records.map(r => {
                        const date = new Date(r.date);
                        return date.toLocaleDateString('en', { weekday: 'short' });
                    }),
                    emissions: summary.recent_records.map(r => r.emissions),
                    targets: summary.recent_records.map(() => summary.targets.daily)
                };

                setTodayData(todayDataFromAPI);
                setWeeklyData(weeklyDataFromAPI);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Failed to load dashboard data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const pieChartData = todayData ? {
        labels: ['Transport', 'Grid Energy', 'Paper', 'Generator', 'Solar Savings'],
        datasets: [{
            data: [
                todayData.breakdown.transport,
                todayData.breakdown.energy,
                todayData.breakdown.paper,
                todayData.breakdown.generator,
                Math.abs(todayData.breakdown.solarSavings)
            ],
            backgroundColor: [
                '#ef4444',
                '#f59e0b',
                '#84cc16',
                '#6b7280',
                '#10b981'
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
        }]
    } : null;

    const lineChartData = weeklyData ? {
        labels: weeklyData.dates,
        datasets: [
            {
                label: 'Daily Emissions',
                data: weeklyData.emissions,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                pointRadius: 6
            },
            {
                label: 'Target',
                data: weeklyData.targets,
                borderColor: '#10b981',
                borderDash: [5, 5],
                tension: 0,
                pointRadius: 0
            }
        ]
    } : null;

    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading emissions data...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Dashboard</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!todayData) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
                        <p className="text-gray-600 mb-4">No emissions data has been recorded yet.</p>
                        {user?.role === 'admin' && (
                            <a href="/daily-entry" className="btn-primary">
                                Enter Today's Data
                            </a>
                        )}
                    </div>
                </div>
            </Layout>
        );
    }

    const containerStyle = {
        backgroundColor: '#f9fafb',
    };

    const headerStyle = {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: '50% 68%',
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
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <div style={headerOverlay}></div>
                    <div style={headerContent} className="flex items-end justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white flex items-center space-x-3">
                                <Leaf className="h-10 w-10 text-green-400" />
                                <span><span style={{ fontFamily: 'Times New Roman, serif', fontWeight: 500 }}>SUPERIOR</span> Carbon Footprint Tracker</span>
                            </h1>
                            <p className="text-green-100 mt-2 ml-14">Track and monitor university carbon emissions</p>
                        </div>
                        <div className="text-right">
                            <p className="text-green-100">Today's Date</p>
                            <p className="text-2xl font-semibold text-white">{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">

                    {/* View Toggle */}
                    <div className="flex justify-center">
                        <div >
                            <button
                                onClick={() => setViewMode('daily')}
                                className={`px-6 py-3 mx-0.5 rounded-xl transition-colors duration-70 ease-out font-medium border-none outline-none focus:ring-0 focus:outline-none ${viewMode === 'daily'
                                    ? 'bg-[#632b7d] text-white shadow-lg transform scale-105'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200 hover:shadow-sm'
                                    }`}
                            >
                                <Calendar className="h-4 w-4 inline mr-2" />
                                <span>Today's Analysis</span>
                            </button>
                            <button
                                onClick={() => setViewMode('weekly')}
                                className={`px-6 py-3 mx-0.5 rounded-xl transition-colors duration-70 ease-out font-medium border-none outline-none focus:ring-0 focus:outline-none ${viewMode === 'weekly'
                                    ? 'bg-[#632b7d] text-white shadow-lg transform scale-105'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200 hover:shadow-sm'
                                    }`}
                            >
                                <BarChart className="h-4 w-4 inline mr-2" />
                                <span>Weekly Trends</span>
                            </button>
                        </div>
                    </div>

                    {viewMode === 'daily' && todayData && (
                        <>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="stat-card">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-primary-700 text-sm font-medium">Total Emissions</p>
                                            <p className="text-3xl font-bold text-primary-900">{Number(todayData.totalEmissions).toFixed(2)}</p>
                                            <p className="text-primary-600 text-sm">kg CO₂ today</p>
                                        </div>
                                        <Leaf className="h-8 w-8 text-primary-600" />
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600 text-sm font-medium">Transport</p>
                                            <p className="text-2xl font-bold text-red-600">{Number(todayData.breakdown.transport).toFixed(2)}</p>
                                            <p className="text-gray-500 text-sm">kg CO₂</p>
                                        </div>
                                        <Car className="h-8 w-8 text-red-500" />
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600 text-sm font-medium">Grid Energy</p>
                                            <p className="text-2xl font-bold text-amber-600">{Number(todayData.breakdown.energy).toFixed(2)}</p>
                                            <p className="text-gray-500 text-sm">kg CO₂</p>
                                        </div>
                                        <Zap className="h-8 w-8 text-amber-500" />
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-600 text-sm font-medium">Solar Savings</p>
                                            <p className="text-2xl font-bold text-green-600">{Number(todayData.breakdown.solarSavings).toFixed(2)}</p>
                                            <p className="text-gray-500 text-sm">kg CO₂</p>
                                        </div>
                                        <Sun className="h-8 w-8 text-green-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="card">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Emissions Breakdown</h2>
                                    {pieChartData && (
                                        <div className="h-80">
                                            <Pie
                                                data={pieChartData}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        legend: {
                                                            position: 'right'
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="card">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Target Progress</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                <span>Daily Target</span>
                                                <span>{Number(todayData.totalEmissions).toFixed(2)} / {Number(todayData.targets.daily).toFixed(2)} kg</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div
                                                    className={`h-3 rounded-full ${todayData.totalEmissions > todayData.targets.daily
                                                        ? 'bg-red-500'
                                                        : 'bg-green-500'
                                                        }`}
                                                    style={{
                                                        width: `${Math.min((todayData.totalEmissions / todayData.targets.daily) * 100, 100)}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="pt-4 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Transport</span>
                                                <span className="text-red-600 font-medium">{Number(todayData.breakdown.transport).toFixed(2)} kg</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Energy</span>
                                                <span className="text-amber-600 font-medium">{Number(todayData.breakdown.energy).toFixed(2)} kg</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Paper</span>
                                                <span className="text-lime-600 font-medium">{Number(todayData.breakdown.paper).toFixed(2)} kg</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600">Generator</span>
                                                <span className="text-gray-600 font-medium">{Number(todayData.breakdown.generator).toFixed(2)} kg</span>
                                            </div>
                                            <div className="flex items-center justify-between border-t pt-2">
                                                <span className="text-gray-600">Solar Offset</span>
                                                <span className="text-green-600 font-medium">{Number(todayData.breakdown.solarSavings).toFixed(2)} kg</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {viewMode === 'weekly' && weeklyData && (
                        <div className="card">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <TrendingUp className="h-5 w-5" />
                                <span>Weekly Emission Trends</span>
                            </h2>
                            {lineChartData && (
                                <div className="h-80">
                                    <Line
                                        data={lineChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    title: {
                                                        display: true,
                                                        text: 'CO₂ Emissions (kg)'
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            )}

                            <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{Number(weeklyData.emissions.reduce((a, b) => a + b, 0)).toFixed(2)}</p>
                                    <p className="text-gray-600 text-sm">Total This Week</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{Number(weeklyData.emissions.reduce((a, b) => a + b, 0) / 7).toFixed(2)}</p>
                                    <p className="text-gray-600 text-sm">Daily Average</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">-12.3%</p>
                                    <p className="text-gray-600 text-sm">vs Last Week</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    {/* {user?.role === 'admin' && (
                    <div className="card">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <Calendar className="h-6 w-6 text-primary-600" />
                                <span className="font-medium text-gray-900">Enter Today's Data</span>
                            </button>

                            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <Settings className="h-6 w-6 text-primary-600" />
                                <span className="font-medium text-gray-900">Update Settings</span>
                            </button>

                            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <BarChart className="h-6 w-6 text-primary-600" />
                                <span className="font-medium text-gray-900">View Reports</span>
                            </button>
                        </div>
                    </div>
                )}*/}
                </div>
            </div>
        </Layout>
    );
};

export default DashboardPage;
