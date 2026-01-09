import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { login, isAuthenticated, getRoleBasedPath } from '../../lib/auth';
import Notification, { NotificationProps } from '../../components/Notification';
import '../../app/globals.css';

const Login: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<NotificationProps | null>(null);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated()) {
            const user = JSON.parse(localStorage.getItem('authUser') || '{}');
            router.push(getRoleBasedPath(user.role));
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email || !password) {
            setNotification({
                type: 'error',
                message: 'Please fill in all fields',
                duration: 4000
            });
            return;
        }

        setIsLoading(true);

        try {
            const result = await login(email, password);
            
            if (result.success && result.user) {
                setNotification({
                    type: 'success',
                    message: 'Login successful! Redirecting...',
                    duration: 2000
                });

                // Redirect based on role after a brief delay
                setTimeout(() => {
                    const redirectPath = getRoleBasedPath(result.user!.role);
                    router.push(redirectPath);
                }, 1000);
            } else {
                setNotification({
                    type: 'error',
                    message: result.error || 'Login failed. Please try again.',
                    duration: 4000
                });
            }
        } catch (error) {
            setNotification({
                type: 'error',
                message: 'An unexpected error occurred. Please try again.',
                duration: 4000
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
            {/* Notification */}
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    duration={notification.duration}
                    onClose={() => setNotification(null)}
                />
            )}

            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl -z-10"></div>

            <div className="w-full max-w-md">
                {/* Logo/Header Section */}
                <div className="text-center mb-8">
<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full overflow-hidden mb-4 shadow-lg">
  <img
    src="/citiedge-logo.png"
    alt="CITIEDGE Logo"
    className="w-full h-full object-cover"
  />
</div>
           
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600">Sign in to your CITIEDGE Portal</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="relative h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

                    <form onSubmit={handleSubmit} className="p-8">
                        {/* Email Field */}
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-3">
                                Email Address
                            </label>
                            <div className={`relative transition-all duration-200 ${
                                focusedField === 'email' 
                                    ? 'ring-2 ring-blue-600 rounded-xl' 
                                    : 'ring-1 ring-gray-200 rounded-xl'
                            }`}>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-3 bg-transparent outline-none text-gray-900 placeholder-gray-400"
                                    required
                                    disabled={isLoading}
                                />
                                {email && (
                                    <div className="absolute right-4 top-3.5 text-blue-600">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-3">
                                Password
                            </label>
                            <div className={`relative transition-all duration-200 ${
                                focusedField === 'password' 
                                    ? 'ring-2 ring-blue-600 rounded-xl' 
                                    : 'ring-1 ring-gray-200 rounded-xl'
                            }`}>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-transparent outline-none text-gray-900 placeholder-gray-400"
                                    required
                                    disabled={isLoading}
                                />
                                {password && (
                                    <div className="absolute right-4 top-3.5 text-blue-600">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="mb-8 flex items-center">
                            <label className="flex items-center cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-5 h-5 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                    Remember me
                                </span>
                            </label>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-blue-600/30 hover:from-blue-700 hover:to-indigo-700 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m4.22 1.78l-.707.707M20 12h1m-1.78 4.22l-.707-.707M12 20v1m-4.22-1.78l.707-.707M4 12H3m1.78-4.22l.707.707" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Note */}
                <div className="text-center mt-6">
                    <p className="text-gray-600 text-sm">
                        For login assistance, please contact your administrator
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;