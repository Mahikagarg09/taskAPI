import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
    const navigate= useNavigate();
    const [showSignUp, setShowSignUp] = useState(false);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        phone: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSignUpToggle = () => {
        setShowSignUp(!showSignUp);
        setMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = showSignUp ? 'http://localhost:3000/api/auth/register' : 'http://localhost:3000/api/auth/login';

        try {
            const response = await axios.post(url, formData);

            const data = response.data;

            if (response.status === 200) {
                console.log('Token received:', data.token);
                setMessage(data.message);
                // Clear form data after successful submission
                setFormData({ email: '', password: '', phone: '' });
                navigate("/");
            } else {
                setMessage(data.message);
            }
            
        } catch (error) {
            console.error('An unexpected error occurred:', error);
            setMessage('An unexpected error occurred. Please try again.');
        }
    };


    return (
        <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    {showSignUp && (
                        <div>
                            <div className="mt-2">
                                <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                                    Phone
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    autoComplete="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {showSignUp ? 'Sign Up' : 'Sign in'}
                        </button>
                    </div>

                    <div className="text-center">
                        {showSignUp ? 'Already have an account?' : 'Register here'}
                        <button
                            type="button"
                            onClick={handleSignUpToggle}
                            className="text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline"
                        >
                            {showSignUp ? 'Sign in' : 'Sign up'}
                        </button>
                    </div>
                    {message && (
                        <div className={`text-sm ${message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
