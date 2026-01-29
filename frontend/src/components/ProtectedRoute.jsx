import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import Spinner from './common/Spinner';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (requiredRole && user?.role !== requiredRole) {
                // Redirect to their respective home if role doesn't match
                router.push(user?.role === 'admin' ? '/admin/dashboard' : '/menu');
            }
        }
    }, [isAuthenticated, isLoading, user, router, requiredRole]);

    if (isLoading || !isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="large" />
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
