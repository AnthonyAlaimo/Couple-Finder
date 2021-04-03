import { createContext, useState, useCallback, useEffect } from 'react';
import fetchApi from '../utils/fetchApi';

export const UserContext = createContext({
    logout: () => {},
    login: () => {},
    register: () => {},
    user: null,
});

export default function UserProvider({ children }) {
    const [ user, setUser ] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                // TODO: Some fetch
                // fetch(xxx, { ..., signal: controller.signal });
                if (!controller.signal.aborted) {
                    setUser({
                        _id: 'uwu',
                        password: 'FROM SESSION',
                        email: 'FROM SESSION',
                    });
                }
            } catch (err) {
                if (err.name === `AbortError`) {
                    // No problem, we did this
                    return;
                }
                throw err;
            }
        })();

        return () => {
            controller.abort();
        };
    }, []);

    const login = useCallback(async (email, password) => {
        // post request for signing in sent to backend
        const user = await fetchApi(`/signin/`, `POST`, {
            password,
            email,
        });

        console.log(user);
        setUser({
            _id: 'owo',
            password,
            email,
        });
    }, []);

    const register = useCallback(async (email, password) => {
        // post request for signing in sent to backend
        const user = await fetchApi(`/signup/`, `POST`, {
            password,
            email,
        });

        console.log(user);
        setUser({
            _id: 'owo',
            password,
            email,
        });
    }, []);

    const logout = useCallback(async () => {
        // TODO: API request
        await fetchApi(`/signout/`, `GET`, {});
        setUser(null);
    }, []);

    return (
        <UserContext.Provider value={{
            logout,
            register,
            login,
            user,
        }}>
            {children}
        </UserContext.Provider>
    )
}