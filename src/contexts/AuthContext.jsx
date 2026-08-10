import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"

import { supabase } from "../lib/supabase"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function carregarSessao() {
            const {
                data: { session },
            } = await supabase.auth.getSession()

            setUser(session?.user ?? null)
            setLoading(false)
        }

        carregarSessao()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null)
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    async function login(
        email,
        senha,
        captchaToken
    ) {
        if (!captchaToken) {
            return {
                success: false,
                message: "Captcha não validado.",
            }
        }

        const { error } =
            await supabase.auth.signInWithPassword({
                email,
                password: senha,
                options: {
                    captchaToken,
                },
            })

        if (error) {
            return {
                success: false,
                message: error.message,
            }
        }

        return {
            success: true,
        }
    }

    async function logout() {
        await supabase.auth.signOut()
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error(
            "useAuth deve ser usado dentro de AuthProvider"
        )
    }

    return context
}