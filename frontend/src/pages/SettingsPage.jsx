import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import {
    Settings,
    Plus,
    Edit,
    Trash2,
    Save
} from 'lucide-react';
import { dataAPI, settingsAPI } from '../services/api';
import bgImage from '../assets/2e4f9049-0dc4-4feb-8d6e-771a9b778a9b.jpeg';
const SettingsPage = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedAssetType, setSelectedAssetType] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);
    const [universityAssets, setUniversityAssets] = useState([]);

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
    const watchedAssetType = watch('name');

    const assetCategories = [
        { value: 'bus', label: 'Bus' },
        { value: 'solar', label: 'Solar' },
        { value: 'paper', label: 'Paper' },
        { value: 'generator', label: 'Generator' },
        { value: 'lab', label: 'Lab' }
    ];

    useEffect(() => {
        console.log('Current user:', user); // Debug log
        console.log('Authentication token:', localStorage.getItem('access_token')); // Debug log

        const loadUniversityAssets = async () => {
            try {
                console.log('Loading university assets...'); // Debug log
                const assets = await dataAPI.getUniversityAssets();
                console.log('Assets loaded from API:', assets); // Debug log
                setUniversityAssets(assets);
            } catch (error) {
                console.error('Error loading university assets:', error);
                console.error('Error details:', error.response?.data); // More detailed error
                setUniversityAssets([]);
            }
        };

        loadUniversityAssets();
    }, [user]);

    const handleSaveAsset = async (data) => {
        setIsLoading(true);
        setSuccessMessage('');

        try {
            console.log('Saving asset data:', data); // Debug log
            const assetData = {
                assets: [{
                    category: data.name,
                    quantity: parseInt(data.quantity || 1),
                    power: data.power ? parseFloat(data.power) : null,
                    fuel_type: data.fuel_type || null
                }]
            };

            console.log('Asset payload:', assetData);
            const result = await settingsAPI.updateUniversityResources(assetData);
            console.log('Save result:', result);

            const updatedAssets = await dataAPI.getUniversityAssets();
            console.log('Updated assets from API:', updatedAssets);
            setUniversityAssets(updatedAssets);

            setEditingAsset(null);
            setShowForm(false);
            setSelectedAssetType('');
            reset();
            setSuccessMessage('Asset saved successfully!');
        } catch (error) {
            console.error('Error saving asset:', error);
            console.error('Error details:', error.response?.data);
            setSuccessMessage(`Failed to save asset: ${error.response?.data?.detail || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteAsset = async (assetId) => {

        try {
            const assets = await dataAPI.getUniversityAssets();
            setUniversityAssets(assets);
            setSuccessMessage('Asset deleted successfully!');
        } catch (error) {
            console.error('Error deleting asset:', error);
        }
    };

    const startEdit = (asset) => {
        setEditingAsset(asset);
        setShowForm(true);
        setSelectedAssetType(asset.name);
        reset({
            name: asset.name,
            quantity: asset.quantity,
            power: asset.power,
            fuel_type: asset.fuel_type
        });
    };

    const cancelEdit = () => {
        setEditingAsset(null);
        setShowForm(false);
        setSelectedAssetType('');
        reset();
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
            <div className="space-y-6">
                <div style={headerStyle}>
                    <div style={headerOverlay}></div>
                    <div style={headerContent} className="flex items-end justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white">Settings</h1>
                            <p className="mt-1 text-sm text-green-100">
                                Configure university resources and assets for carbon footprint tracking
                            </p>
                        </div>
                    </div>
                </div>

                {successMessage && (
                    <div className={`p-4 rounded-lg ${successMessage.includes('Failed')
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                        {successMessage}
                    </div>
                )}

                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                                <Settings className="h-5 w-5" />
                                <span>University Resources</span>
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Manage assets like buses, solar panels, labs, and generators
                            </p>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="btn-primary flex items-center space-x-2"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Asset</span>
                        </button>
                    </div>

                    {showForm && (
                        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                            <h3 className="text-md font-medium text-gray-900 mb-4">
                                {editingAsset ? 'Edit Asset' : 'Add New Asset'}
                            </h3>

                            <form onSubmit={handleSubmit(handleSaveAsset)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Resource Name
                                    </label>
                                    <select
                                        {...register('name', { required: 'Asset name is required' })}
                                        className="input-field"
                                        onChange={(e) => setSelectedAssetType(e.target.value)}
                                        disabled={isLoading}
                                    >
                                        <option value="">Select resource type...</option>
                                        {assetCategories.map(category => (
                                            <option key={category.value} value={category.value}>
                                                {category.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.name && (
                                        <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                {(selectedAssetType || watchedAssetType) && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Quantity
                                            </label>
                                            <input
                                                type="number"
                                                {...register('quantity', {
                                                    required: 'Quantity is required',
                                                    min: { value: 1, message: 'Quantity must be at least 1' }
                                                })}
                                                className="input-field"
                                                placeholder="Enter quantity"
                                                disabled={isLoading}
                                            />
                                            {errors.quantity && (
                                                <p className="text-red-600 text-sm mt-1">{errors.quantity.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Power (kW)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                {...register('power')}
                                                className="input-field"
                                                placeholder="Enter power in kW (optional)"
                                                disabled={isLoading}
                                            />
                                        </div>

                                        {/* Fuel Type - Hidden for 'lab' and 'solar' */}
                                        {selectedAssetType !== 'lab' && watchedAssetType !== 'lab' &&
                                            selectedAssetType !== 'solar' && watchedAssetType !== 'solar' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Fuel Type
                                                    </label>
                                                    <input
                                                        type="text"
                                                        {...register('fuel_type')}
                                                        className="input-field"
                                                        placeholder="e.g., diesel, gasoline (optional)"
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            )}

                                        {/* Action Buttons */}
                                        <div className="flex justify-end space-x-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={cancelEdit}
                                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                                disabled={isLoading}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                ) : (
                                                    <Save className="h-4 w-4" />
                                                )}
                                                <span>{editingAsset ? 'Update' : 'Save'} Asset</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </form>
                        </div>
                    )}

                    {/* Assets List */}
                    <div className="space-y-4">
                        {universityAssets.length > 0 ? (
                            <div className="grid gap-4">
                                {universityAssets.map(asset => (
                                    <div key={asset.id} className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3">
                                                <div className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                                                    {asset.name}
                                                </div>
                                                <div className="text-gray-500">•</div>
                                                <div className="text-sm text-gray-600">
                                                    Quantity: <span className="font-medium">{asset.quantity}</span>
                                                </div>
                                                {asset.power && (
                                                    <>
                                                        <div className="text-gray-500">•</div>
                                                        <div className="text-sm text-gray-600">
                                                            Power: <span className="font-medium">{asset.power} kW</span>
                                                        </div>
                                                    </>
                                                )}
                                                {asset.fuel_type && (
                                                    <>
                                                        <div className="text-gray-500">•</div>
                                                        <div className="text-sm text-gray-600">
                                                            Fuel: <span className="font-medium capitalize">{asset.fuel_type}</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => startEdit(asset)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteAsset(asset.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No assets configured</h3>
                                <p className="text-sm">Add university resources to begin carbon footprint tracking</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SettingsPage;