import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { Car, Zap, FileText, Settings, Plus, Filter, Save } from 'lucide-react';
import { settingsAPI } from '../services/api';
import bgImage from '../assets/5f6cb232-d38f-4a43-b197-eaeb0ff2ef08.jpeg';
const DataEntryPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const emissionCategories = [
        {
            id: 'transportation',
            name: 'Transportation',
            icon: Car,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            fields: [
                { name: 'total_distance', label: 'Total Distance (km)', placeholder: '0' }
            ]
        },
        {
            id: 'energy',
            name: 'Energy Consumption',
            icon: Zap,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            fields: [
                { name: 'grid_consumption', label: 'Grid Consumption (kWh)', placeholder: '0' },
                { name: 'solar_consumption', label: 'Solar Consumption (kWh)', placeholder: '0' }
            ]
        },
        {
            id: 'generator',
            name: 'Generator Usage',
            icon: Settings,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            fields: [
                { name: 'gen_hrs', label: 'Generator Hours', placeholder: '0' },
                { name: 'gen_fuel_liters', label: 'Generator Fuel (Liters)', placeholder: '0' }
            ]
        },
        {
            id: 'operations',
            name: 'Operations',
            icon: FileText,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            fields: [
                { name: 'lab_active_hrs', label: 'Lab Active Hours', placeholder: '8' },
                { name: 'paper_consumption', label: 'Paper Consumption (sheets)', placeholder: '0' }
            ]
        }
    ];

    const onSubmit = async (data) => {
        setIsLoading(true);
        setSuccessMessage('');

        try {
            const dailyConsumption = {
                total_distance: parseFloat(data.total_distance || 0),
                grid_consumption: parseFloat(data.grid_consumption || 0),
                solar_consumption: parseFloat(data.solar_consumption || 0),
                gen_hrs: parseFloat(data.gen_hrs || 0),
                lab_active_hrs: parseFloat(data.lab_active_hrs || 8),
                paper_consumption: parseInt(data.paper_consumption || 0),
                gen_fuel_liters: parseFloat(data.gen_fuel_liters || 0)
            };

            await settingsAPI.logDailyConsumption(dailyConsumption);
            setSuccessMessage('Emissions data saved successfully!');
            reset();
        } catch (error) {
            console.error('Error saving emission data:', error);
            setSuccessMessage('Failed to save emissions data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

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
                            <h1 className="text-4xl font-bold text-white flex items-center space-x-3">Daily Data Entry</h1>
                            <p className="text-green-100">Record your daily carbon footprint activities</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    {/* <div className="flex items-center justify-between mb-6">

                        <div className="flex items-center space-x-2 text-gray-500">
                            <Filter size={20} />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="input-field"
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div> */}

                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {emissionCategories.map((category) => {
                            const IconComponent = category.icon;
                            return (
                                <div key={category.id} className={`${category.bgColor} rounded-lg p-6`}>
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className={`${category.color} p-2 rounded-lg bg-white`}>
                                            <IconComponent size={24} />
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-900">{category.name}</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {category.fields.map((field) => (
                                            <div key={field.name}>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    {field.label}
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    placeholder={field.placeholder}
                                                    {...register(field.name, {
                                                        min: { value: 0, message: 'Value must be positive' }
                                                    })}
                                                    className="input-field"
                                                />
                                                {errors[field.name] && (
                                                    <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        <div className="flex items-center justify-between pt-4 border-t">
                            <button
                                type="button"
                                onClick={() => reset()}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Clear Form
                            </button>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary flex items-center space-x-2"
                            >
                                <Save size={16} />
                                <span>{isLoading ? 'Saving...' : 'Save Data'}</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Quick Tips */}
                <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                        <Plus size={20} className="mr-2" />
                        Quick Tips for Accurate Tracking
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                        <div>
                            <h4 className="font-medium mb-1">Transportation</h4>
                            <ul className="space-y-1">
                                <li>• Record total distance traveled in kilometers</li>
                                <li>• Include all transportation modes combined</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Energy</h4>
                            <ul className="space-y-1">
                                <li>• Record grid and solar consumption separately</li>
                                <li>• Check meter readings for accuracy</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Generator</h4>
                            <ul className="space-y-1">
                                <li>• Record actual hours of generator usage</li>
                                <li>• Include fuel consumption in liters</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Operations</h4>
                            <ul className="space-y-1">
                                <li>• Lab hours: actual operational hours</li>
                                <li>• Paper: count sheets used for the day</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DataEntryPage;