'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginStaff } from '@/services/staffAPI';

export default function LoginForm() {
    const router = useRouter();
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
        setError(''); // Clear error when user types
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        console.log('Attempting login with:', formData.email);

        try {
        const result = await loginStaff(formData.email, formData.password);

        if (result.success) {
            console.log('Login successful:', result.staff);
            
            // Store staff info in localStorage
            localStorage.setItem('staff', JSON.stringify(result.staff));
            
            // Redirect to dashboard
            router.push('/dashboard');
        } else {
            setError(result.message || 'Invalid credentials');
        }
        } catch (err) {
        console.error('Login error:', err);
        setError('An error occurred. Please try again.');
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
            </label>
            <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="eg. john.tan@ocbc.com"
            required
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 
            focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-black placeholder:text-gray-600"
            />
        </div>

        {/* Password Input */}
        <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
            </label>
            <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 
            focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-black placeholder:text-gray-600"
            />
        </div>

        {/* Error Message */}
        {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
            </div>
        )}

        {/* Login Button */}
        <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            {isLoading ? 'Logging in...' : 'Login'}
        </button>
        </form>
    );
}
