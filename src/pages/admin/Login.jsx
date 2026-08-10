import { useState } from "react"
import "../../styles/login.css"

import {
    Navigate,
    useNavigate,
} from "react-router-dom"

import {
    FiEye,
    FiEyeOff,
    FiLock,
    FiLogIn,
    FiUser,
} from "react-icons/fi"

import { useAuth } from "../../contexts/AuthContext"

function Login() {
    const { user, login } = useAuth()
    const navigate = useNavigate()

    const [usuario, setUsuario] =
        useState("")

    const [senha, setSenha] =
        useState("")

    const [
        mostrarSenha,
        setMostrarSenha,
    ] = useState(false)

    const [
        mensagemErro,
        setMensagemErro,
    ] = useState("")

    const [
        enviando,
        setEnviando,
    ] = useState(false)

    if (user) {
        return (
            <Navigate
                to="/admin/dashboard"
                replace
            />
        )
    }

    async function handleSubmit(event) {
        event.preventDefault()

        const emailLimpo =
            usuario.trim()

        if (!emailLimpo || !senha) {
            setMensagemErro(
                "Preencha o e-mail e a senha."
            )
            return
        }

        try {
            setEnviando(true)
            setMensagemErro("")

            const resultado =
                await login(
                    emailLimpo,
                    senha
                )

            if (!resultado.success) {
                setMensagemErro(
                    "E-mail ou senha inválidos."
                )
                return
            }

            setMensagemErro("")

            navigate(
                "/admin/dashboard",
                {
                    replace: true,
                }
            )
        } catch (error) {
            console.error(
                "Erro durante o login:",
                error
            )

            setMensagemErro(
                "Não foi possível realizar o login. Tente novamente."
            )
        } finally {
            setEnviando(false)
        }
    }

    return (
        <main className="login-page">
            <section className="login-card">
                <div className="login-card__brand">
                    <div className="login-card__brand-icon">
                        <FiLock />
                    </div>

                    <span>
                        Sistema de Achados e Perdidos
                    </span>
                </div>

                <div className="login-card__header">
                    <span className="login-card__eyebrow">
                        Área administrativa
                    </span>

                    <h1>
                        Bem-vindo
                    </h1>

                    <p>
                        Entre com suas credenciais
                        para acessar o painel
                        administrativo.
                    </p>
                </div>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >
                    <label className="login-form__field">
                        <span>
                            E-mail
                        </span>

                        <div className="login-form__input-wrapper">
                            <FiUser />

                            <input
                                type="email"
                                value={usuario}
                                onChange={(event) => {
                                    setUsuario(
                                        event.target.value
                                    )

                                    setMensagemErro("")
                                }}
                                placeholder="Digite seu e-mail"
                                autoComplete="email"
                                autoFocus
                                required
                                disabled={enviando}
                            />
                        </div>
                    </label>

                    <label className="login-form__field">
                        <span>
                            Senha
                        </span>

                        <div className="login-form__input-wrapper">
                            <FiLock />

                            <input
                                type={
                                    mostrarSenha
                                        ? "text"
                                        : "password"
                                }
                                value={senha}
                                onChange={(event) => {
                                    setSenha(
                                        event.target.value
                                    )

                                    setMensagemErro("")
                                }}
                                placeholder="Digite sua senha"
                                autoComplete="current-password"
                                required
                                disabled={enviando}
                            />

                            <button
                                className="login-form__show-password"
                                type="button"
                                aria-label={
                                    mostrarSenha
                                        ? "Ocultar senha"
                                        : "Mostrar senha"
                                }
                                onClick={() =>
                                    setMostrarSenha(
                                        (valorAtual) =>
                                            !valorAtual
                                    )
                                }
                                disabled={enviando}
                            >
                                {mostrarSenha ? (
                                    <FiEyeOff />
                                ) : (
                                    <FiEye />
                                )}
                            </button>
                        </div>
                    </label>

                    {mensagemErro && (
                        <p
                            className="login-form__error"
                            role="alert"
                        >
                            {mensagemErro}
                        </p>
                    )}

                    <button
                        className="login-form__submit"
                        type="submit"
                        disabled={enviando}
                    >
                        <FiLogIn />

                        {enviando
                            ? "Entrando..."
                            : "Entrar"}
                    </button>
                </form>

                <p className="login-card__footer">
                    Uso exclusivo dos funcionários autorizados.
                </p>
            </section>
        </main>
    )
}

export default Login