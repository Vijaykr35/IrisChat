import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setOtherUsers } from '../redux/userSlice';

function useGetOtherUsers() {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchOtherUsers = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                dispatch(setOtherUsers(res.data));
            } catch (error) {
                console.error('Error fetching other users:', error);
            }
        };

        fetchOtherUsers();
    }, [dispatch]);
}

export default useGetOtherUsers;
