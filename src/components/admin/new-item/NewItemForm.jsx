import {
    useEffect,
    useState,
} from "react"

import {
    FiCamera,
    FiImage,
    FiX,
} from "react-icons/fi"

import { useItems } from "../../../contexts/ItemsContext"
import { ITEM_STATUS } from "../../../constants/itemStatus"
import { categories } from "../../../data/categories"

import {
    deleteImage,
    uploadImage,
} from "../../../services/storageService"

const initialFormData = {
    nome: "",
    categoria: "",
    subcategoria: "",
    dataEncontrado: "",
    observacoes: "",
}

function NewItemForm() {
    const { items, addItem } = useItems()

    const [formData, setFormData] =
        useState(initialFormData)

    const [arquivoFoto, setArquivoFoto] =
        useState(null)

    const [fotoPreview, setFotoPreview] =
        useState("")

    const [mensagem, setMensagem] =
        useState("")

    const [tipoMensagem, setTipoMensagem] =
        useState("")

    const [enviando, setEnviando] =
        useState(false)

    const categoriaSelecionada = categories.find(
        (categoria) =>
            categoria.id === formData.categoria
    )

    const subcategoriasDisponiveis =
        categoriaSelecionada?.subcategorias ?? []

    useEffect(() => {
        return () => {
            if (fotoPreview) {
                URL.revokeObjectURL(fotoPreview)
            }
        }
    }, [fotoPreview])

    function handleChange(event) {
        const { name, value } = event.target

        setFormData((dadosAtuais) => ({
            ...dadosAtuais,
            [name]: value,

            ...(name === "categoria" && {
                subcategoria: "",
            }),
        }))

        setMensagem("")
        setTipoMensagem("")
    }

    function handleFotoChange(event) {
        const arquivo = event.target.files?.[0]

        if (!arquivo) {
            return
        }

        if (!arquivo.type.startsWith("image/")) {
            setMensagem(
                "Selecione um arquivo de imagem válido."
            )
            setTipoMensagem("erro")
            event.target.value = ""
            return
        }

        const tamanhoMaximo = 5 * 1024 * 1024

        if (arquivo.size > tamanhoMaximo) {
            setMensagem(
                "A imagem deve ter no máximo 5 MB."
            )
            setTipoMensagem("erro")
            event.target.value = ""
            return
        }

        if (fotoPreview) {
            URL.revokeObjectURL(fotoPreview)
        }

        const novaPreview =
            URL.createObjectURL(arquivo)

        setArquivoFoto(arquivo)
        setFotoPreview(novaPreview)
        setMensagem("")
        setTipoMensagem("")
    }

    function removerFoto() {
        if (fotoPreview) {
            URL.revokeObjectURL(fotoPreview)
        }

        setArquivoFoto(null)
        setFotoPreview("")
    }

    function gerarCodigo() {
        const numerosDosCodigos = items
            .map((item) => {
                const codigo = item.codigo ?? ""

                return Number(
                    codigo.replace(/\D/g, "")
                )
            })
            .filter((numero) =>
                Number.isFinite(numero)
            )

        const maiorNumero =
            numerosDosCodigos.length > 0
                ? Math.max(...numerosDosCodigos)
                : 0

        const proximoNumero = maiorNumero + 1

        return `CAP-${String(proximoNumero).padStart(
            3,
            "0"
        )}`
    }

    async function handleSubmit(event) {
        event.preventDefault()

        if (enviando) {
            return
        }

        const nomeLimpo =
            formData.nome.trim()

        if (!nomeLimpo) {
            setMensagem(
                "Informe o nome do item."
            )
            setTipoMensagem("erro")
            return
        }

        if (!formData.categoria) {
            setMensagem(
                "Selecione uma categoria."
            )
            setTipoMensagem("erro")
            return
        }

        if (
            subcategoriasDisponiveis.length > 0 &&
            !formData.subcategoria
        ) {
            setMensagem(
                "Selecione uma subcategoria."
            )
            setTipoMensagem("erro")
            return
        }

        if (!formData.dataEncontrado) {
            setMensagem(
                "Informe a data em que o item foi encontrado."
            )
            setTipoMensagem("erro")
            return
        }

        let fotoUrlEnviada = null

        try {
            setEnviando(true)
            setMensagem("")
            setTipoMensagem("")

            if (arquivoFoto) {
                fotoUrlEnviada =
                    await uploadImage(arquivoFoto)
            }

            const codigoGerado = gerarCodigo()

            const novoItem = {
                codigo: codigoGerado,
                nome: nomeLimpo,
                categoria: formData.categoria,

                subcategoria:
                    formData.subcategoria || null,

                dataEncontrado:
                    formData.dataEncontrado,

                fotoUrl: fotoUrlEnviada,

                observacoes:
                    formData.observacoes.trim(),

                status: ITEM_STATUS.ATIVO,

                dataRetirada: null,
                dataDoacao: null,
            }

            await addItem(novoItem)

            removerFoto()
            setFormData(initialFormData)

            setMensagem(
                `Item ${codigoGerado} cadastrado com sucesso!`
            )

            setTipoMensagem("sucesso")
        } catch (error) {
            console.error(
                "Erro no cadastro do item:",
                error
            )

            /*
             * Caso a foto tenha sido enviada, mas o cadastro
             * no banco falhe, removemos a imagem para não
             * deixar um arquivo perdido no Storage.
             */
            if (fotoUrlEnviada) {
                try {
                    await deleteImage(fotoUrlEnviada)
                } catch (deleteError) {
                    console.error(
                        "Erro ao remover imagem após falha:",
                        deleteError
                    )
                }
            }

            setMensagem(
                "Não foi possível cadastrar o item. Tente novamente."
            )

            setTipoMensagem("erro")
        } finally {
            setEnviando(false)
        }
    }

    return (
        <form
            className="new-item-form"
            onSubmit={handleSubmit}
        >
            {mensagem && (
                <p
                    className={`new-item-form__message new-item-form__message--${tipoMensagem}`}
                    role={
                        tipoMensagem === "erro"
                            ? "alert"
                            : "status"
                    }
                >
                    {mensagem}
                </p>
            )}

            <div className="new-item-form__group">
                <label htmlFor="nome">
                    Nome do item
                </label>

                <input
                    id="nome"
                    name="nome"
                    type="text"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Ex.: Carteira preta"
                    required
                    disabled={enviando}
                />
            </div>

            <div className="new-item-form__row">
                <div className="new-item-form__group">
                    <label htmlFor="categoria">
                        Categoria
                    </label>

                    <select
                        id="categoria"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        required
                        disabled={enviando}
                    >
                        <option value="">
                            Selecione uma categoria
                        </option>

                        {categories.map(
                            (categoria) => (
                                <option
                                    key={categoria.id}
                                    value={categoria.id}
                                >
                                    {categoria.nome}
                                </option>
                            )
                        )}
                    </select>
                </div>

                <div className="new-item-form__group">
                    <label htmlFor="subcategoria">
                        Subcategoria
                    </label>

                    <select
                        id="subcategoria"
                        name="subcategoria"
                        value={formData.subcategoria}
                        onChange={handleChange}
                        disabled={
                            enviando ||
                            !formData.categoria ||
                            subcategoriasDisponiveis.length ===
                            0
                        }
                        required={
                            subcategoriasDisponiveis.length >
                            0
                        }
                    >
                        <option value="">
                            {!formData.categoria
                                ? "Escolha uma categoria primeiro"
                                : subcategoriasDisponiveis.length ===
                                    0
                                    ? "Esta categoria não possui subcategorias"
                                    : "Selecione uma subcategoria"}
                        </option>

                        {subcategoriasDisponiveis.map(
                            (subcategoria) => (
                                <option
                                    key={
                                        subcategoria.id
                                    }
                                    value={
                                        subcategoria.id
                                    }
                                >
                                    {
                                        subcategoria.nome
                                    }
                                </option>
                            )
                        )}
                    </select>
                </div>
            </div>

            <div className="new-item-form__row">
                <div className="new-item-form__group">
                    <label htmlFor="dataEncontrado">
                        Data encontrada
                    </label>

                    <input
                        id="dataEncontrado"
                        name="dataEncontrado"
                        type="date"
                        value={
                            formData.dataEncontrado
                        }
                        onChange={handleChange}
                        required
                        disabled={enviando}
                    />
                </div>

                <div className="new-item-form__group">
                    <span className="new-item-form__label">
                        Foto
                    </span>

                    <label
                        className="new-item-form__photo-button"
                        htmlFor="foto"
                    >
                        <FiCamera />

                        {arquivoFoto
                            ? "Trocar foto"
                            : "Selecionar ou tirar foto"}
                    </label>

                    <input
                        id="foto"
                        className="new-item-form__photo-input"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        capture="environment"
                        onChange={handleFotoChange}
                        disabled={enviando}
                    />
                </div>
            </div>

            {fotoPreview && (
                <div className="new-item-form__photo-preview">
                    <img
                        src={fotoPreview}
                        alt="Prévia da foto selecionada"
                    />

                    <div className="new-item-form__photo-preview-info">
                        <FiImage />

                        <span>
                            {arquivoFoto?.name}
                        </span>
                    </div>

                    <button
                        className="new-item-form__photo-remove"
                        type="button"
                        onClick={removerFoto}
                        aria-label="Remover foto selecionada"
                        disabled={enviando}
                    >
                        <FiX />
                        Remover
                    </button>
                </div>
            )}

            <div className="new-item-form__group">
                <label htmlFor="observacoes">
                    Observações
                </label>

                <textarea
                    id="observacoes"
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleChange}
                    placeholder="Ex.: Carteira sem documentos"
                    rows="5"
                    disabled={enviando}
                />
            </div>

            <button
                className="new-item-form__submit"
                type="submit"
                disabled={enviando}
            >
                {enviando
                    ? "Enviando foto e cadastrando..."
                    : "Cadastrar item"}
            </button>
        </form>
    )
}

export default NewItemForm