import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { Calendar, TrendingUp, TrendingDown, Filter, BarChart3 } from 'lucide-react';
import { dataAPI } from '../services/api';
import headerImage from '../assets/6223a01f-8879-4954-aa6e-ff6fab5cd6af.jpeg';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const ReportsPage = () => {
    const [reportType, setReportType] = useState('weekly');
    const [selectedPeriod, setSelectedPeriod] = useState('current');
    const [reportData, setReportData] = useState(null);

    const generateMockData = () => {
        const currentWeek = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Transportation (kg CO₂)',
                    data: [4.2, 3.8, 5.1, 4.5, 4.9, 2.1, 1.5],
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    tension: 0.1
                },
                {
                    label: 'Energy (kg CO₂)',
                    data: [12.5, 11.8, 13.2, 12.1, 11.9, 14.2, 13.8],
                    backgroundColor: 'rgba(245, 158, 11, 0.7)',
                    borderColor: 'rgba(245, 158, 11, 1)',
                    tension: 0.1
                },
                {
                    label: 'Waste (kg CO₂)',
                    data: [1.8, 1.5, 2.1, 1.9, 1.7, 2.3, 2.0],
                    backgroundColor: 'rgba(34, 197, 94, 0.7)',
                    borderColor: 'rgba(34, 197, 94, 1)',
                    tension: 0.1
                },
                {
                    label: 'Water (kg CO₂)',
                    data: [0.8, 0.7, 0.9, 0.8, 0.7, 1.0, 0.9],
                    backgroundColor: 'rgba(6, 182, 212, 0.7)',
                    borderColor: 'rgba(6, 182, 212, 1)',
                    tension: 0.1
                }
            ]
        };

        const monthlyData = {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [
                {
                    label: 'Transportation (kg CO₂)',
                    data: [28.5, 32.1, 29.8, 26.3],
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                },
                {
                    label: 'Energy (kg CO₂)',
                    data: [85.2, 88.7, 91.3, 87.9],
                    backgroundColor: 'rgba(245, 158, 11, 0.7)',
                },
                {
                    label: 'Waste (kg CO₂)',
                    data: [13.2, 14.8, 12.9, 15.1],
                    backgroundColor: 'rgba(34, 197, 94, 0.7)',
                },
                {
                    label: 'Water (kg CO₂)',
                    data: [5.8, 6.2, 5.5, 6.0],
                    backgroundColor: 'rgba(6, 182, 212, 0.7)',
                }
            ]
        };

        return reportType === 'weekly' ? currentWeek : monthlyData;
    };

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const reportData = await dataAPI.getReports(reportType);

                const transformedData = {
                    labels: reportData.chart_data.dates.map(date => {
                        const d = new Date(date);
                        return reportType === 'weekly' ?
                            d.toLocaleDateString('en', { weekday: 'short' }) :
                            d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
                    }),
                    datasets: [{
                        label: 'CO₂ Emissions (kg)',
                        data: reportData.chart_data.emissions,
                        backgroundColor: 'rgba(99, 102, 241, 0.6)',
                        borderColor: 'rgba(99, 102, 241, 1)',
                        borderWidth: 2
                    }],
                    summary: reportData.summary,
                    breakdown: reportData.category_breakdown
                };

                setReportData(transformedData);
            } catch (error) {
                console.error('Error fetching report data:', error);
                setReportData(generateMockData());
            }
        };

        fetchReportData();
    }, [reportType]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `${reportType === 'weekly' ? 'Weekly' : 'Monthly'} Carbon Footprint Report`,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'CO₂ Emissions (kg)'
                }
            }
        }
    };

    const lineChartOptions = {
        ...chartOptions,
        plugins: {
            ...chartOptions.plugins,
            title: {
                display: true,
                text: 'Emission Trends Over Time'
            }
        }
    };

    const calculateSummary = () => {
        if (!reportData) return {};

        const totals = reportData.datasets.reduce((acc, dataset) => {
            const total = dataset.data.reduce((sum, value) => sum + value, 0);
            acc[dataset.label] = total;
            return acc;
        }, {});

        const grandTotal = Object.values(totals).reduce((sum, value) => sum + value, 0);
        const average = grandTotal / reportData.labels.length;

        return {
            totals,
            grandTotal,
            average,
            highest: Math.max(...reportData.labels.map((_, index) =>
                reportData.datasets.reduce((sum, dataset) => sum + dataset.data[index], 0)
            )),
            lowest: Math.min(...reportData.labels.map((_, index) =>
                reportData.datasets.reduce((sum, dataset) => sum + dataset.data[index], 0)
            ))
        };
    };

    const summary = calculateSummary();

    const containerStyle = {
        backgroundColor: '#f9fafb',
        overflow: 'visible',
    };

    const headerStyle = {
        backgroundImage: `url(${headerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: '50% 77%',
        backgroundAttachment: 'fixed',
        position: 'relative',
        margin: '-2rem -2rem 1rem -2rem',
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
                    <div style={headerContent} className="flex flex-col sm:flex-row justify-between items-start sm:items-end space-y-4 sm:space-y-0">

                        <div>
                            <h1 className="text-4xl font-bold text-white">Emission Reports</h1>
                            <p className="text-green-100 mt-2">Analyze your carbon footprint patterns and trends</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center py-4 mb-4 px-0">
                    <div>
                        <button
                            onClick={() => setReportType('weekly')}
                            className={`px-6 py-3 mx-0.5 rounded-xl transition-colors duration-70 ease-out font-medium border-none outline-none focus:ring-0 focus:outline-none ${reportType === 'weekly'
                                ? 'bg-[#632b7d] text-white shadow-lg transform scale-105'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200 hover:shadow-sm'
                                }`}
                        >
                            <Calendar className="h-4 w-4 inline mr-2" />
                            <span>Weekly Report</span>
                        </button>
                        <button
                            onClick={() => setReportType('monthly')}
                            className={`px-6 py-3 mx-0.5 rounded-xl transition-colors duration-70 ease-out font-medium border-none outline-none focus:ring-0 focus:outline-none ${reportType === 'monthly'
                                ? 'bg-[#632b7d] text-white shadow-lg transform scale-105'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200 hover:shadow-sm'
                                }`}
                        >
                            <BarChart3 className="h-4 w-4 inline mr-2" />
                            <span>Monthly Report</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="stat-card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Emissions</p>
                                    <p className="text-2xl font-bold text-gray-900">{summary.grandTotal?.toFixed(1)} kg</p>
                                </div>
                                <BarChart3 className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Daily Average</p>
                                    <p className="text-2xl font-bold text-gray-900">{summary.average?.toFixed(1)} kg</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-green-600" />
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Highest Day</p>
                                    <p className="text-2xl font-bold text-red-600">{summary.highest?.toFixed(1)} kg</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-red-600" />
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Lowest Day</p>
                                    <p className="text-2xl font-bold text-green-600">{summary.lowest?.toFixed(1)} kg</p>
                                </div>
                                <TrendingDown className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Bar Chart */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-4">Emissions by Category</h2>
                            {reportData && <Bar data={reportData} options={chartOptions} />}
                        </div>

                        {/* Line Chart */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-4">Trends Over Time</h2>
                            {reportData && (
                                <Line
                                    data={{
                                        ...reportData,
                                        datasets: reportData.datasets.map((dataset, index) => ({
                                            ...dataset,
                                            backgroundColor: dataset.borderColor,
                                            fill: false,
                                            pointBackgroundColor: dataset.borderColor,
                                            pointBorderColor: dataset.borderColor,
                                            pointRadius: 4,
                                        }))
                                    }}
                                    options={lineChartOptions}
                                />
                            )}
                        </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Category Breakdown</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {Object.entries(summary.totals || {}).map(([category, total]) => {
                                const percentage = ((total / summary.grandTotal) * 100).toFixed(1);
                                const colors = {
                                    'Transportation (kg CO₂)': 'bg-blue-500',
                                    'Energy (kg CO₂)': 'bg-yellow-500',
                                    'Waste (kg CO₂)': 'bg-green-500',
                                    'Water (kg CO₂)': 'bg-cyan-500'
                                };

                                return (
                                    <div key={category} className="border rounded-lg p-4">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <div className={`w-4 h-4 rounded ${colors[category]}`}></div>
                                            <span className="font-medium text-gray-900">
                                                {category.replace(' (kg CO₂)', '')}
                                            </span>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">{total.toFixed(1)} kg</p>
                                        <p className="text-sm text-gray-600">{percentage}% of total</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900">Recommendations</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium text-green-800 mb-2">Top Improvement Areas:</h3>
                                <ul className="space-y-1 text-sm text-green-700">
                                    <li>• Energy consumption: Consider LED bulbs and energy-efficient appliances</li>
                                    <li>• Transportation: Try carpooling or public transit 2 days per week</li>
                                    <li>• Waste reduction: Increase recycling and composting efforts</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-medium text-blue-800 mb-2">Quick Wins:</h3>
                                <ul className="space-y-1 text-sm text-blue-700">
                                    <li>• Unplug devices when not in use</li>
                                    <li>• Take shorter showers to reduce water usage</li>
                                    <li>• Walk or bike for short trips under 2km</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </Layout>
    );
};

export default ReportsPage;