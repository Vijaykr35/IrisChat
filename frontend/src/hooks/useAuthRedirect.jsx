import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function useAuthRedirect() {
    const authUser = useSelector(store => store.user.authUser);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authUser) {
            navigate('/login');
        }
    }, [authUser, navigate]);
}

export default useAuthRedirect;
