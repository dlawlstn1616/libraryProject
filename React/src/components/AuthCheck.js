import { useState, useEffect } from 'react';
import axios from 'axios';

const AuthCheck = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get('/api/user')
            .then(response => setUser(response.data))
            .catch(() => setUser(null));
    }, []);

    return user;
};

export default AuthCheck;