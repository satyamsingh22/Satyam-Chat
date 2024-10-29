import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {  // Corrected prop name to 'children'
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);  // Add dependencies to useEffect to avoid potential issues

    return (
        <>
            {children}
        </>
    );
};

export default ProtectedRoute;
