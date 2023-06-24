import { useState, useEffect, createContext } from 'react';

import { supabase } from '../lib/supabaseClient'
import { Toaster } from 'react-hot-toast';

export const AuthContext = createContext({});

export const AuthContextProvider = ({
    children,
}) => {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setLoading(false)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setLoading(false)
        })
    }, [])

    return (
        <AuthContext.Provider value={{ session }}>
            {loading ? <div>Loading...</div> : children}
            <Toaster />
        </AuthContext.Provider>
    );
};
