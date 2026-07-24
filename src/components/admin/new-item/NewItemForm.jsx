import { useState } from "react"
import { useItems } from "../../../contexts/ItemsContext"
import { ITEM_STATUS } from "../../../constants/itemStatus"
import { categories } from "../../../data/categories"

const initialFormData = {
    nome: "",
    categoria: "",
    subcategoria: "",
    dataEncontrado: "",
    observacoes: "",
    fotoUrl: "",
}

function NewItemForm() {
    const { items, addItem } = useItems()

    const [formData, setFormData] = useState(initialFormData)
    const [mensagem, setMensagem] = useState("")

    const categoriaSelecionada = categories.find(
        (categoria) => categoria.id === formData.categoria
    )

    const subcategoriasDisponiveis =
        categoriaSelecionada?.subcategorias ?? []

    function handleChange(event) {
        const { name, value } = event.target

        setFormData((dadosAtuais) => ({
            ...dadosAtuais,
            [name]: value,

            // Se mudar a categoria, limpa a subcategoria anterior
            ...(name === "categoria" && {
                subcategoria: "",
            }),
        }))

        setMensagem("")
    }

    function gerarCodigo() {
        const numerosDosCodigos = items
            .map((item) => {
                const codigo = item.codigo ?? ""
                return Number(codigo.replace(/\D/g, ""))
            })
            .filter((numero) => Number.isFinite(numero))

        const maiorNumero =
            numerosDosCodigos.length > 0
                ? Math.max(...numerosDosCodigos)
                : 0

        const proximoNumero = maiorNumero + 1

        return `CAP-${String(proximoNumero).padStart(3, "0")}`
    }

    function gerarId() {
        if (
            typeof crypto !== "undefined" &&
            typeof crypto.randomUUID === "function"
        ) {
            return crypto.randomUUID()
        }

        return `${Date.now()}-${Math.random()}`
    }

    function handleSubmit(event) {
        event.preventDefault()

        const nomeLimpo = formData.nome.trim()

        if (!nomeLimpo) {
            setMensagem("Informe o nome do item.")
            return
        }

        if (!formData.categoria) {
            setMensagem("Selecione uma categoria.")
            return
        }

        if (
            subcategoriasDisponiveis.length > 0 &&
            !formData.subcategoria
        ) {
            setMensagem("Selecione uma subcategoria.")
            return
        }

        const codigoGerado = gerarCodigo()

        const novoItem = {
            id: gerarId(),
            codigo: codigoGerado,
            nome: nomeLimpo,
            categoria: formData.categoria,
            subcategoria: formData.subcategoria || null,
            dataEncontrado: formData.dataEncontrado,
            dataCadastro: new Date().toISOString(),
            foto: formData.fotoUrl.trim(),
            observacoes: formData.observacoes.trim(),
            status: ITEM_STATUS.ATIVO,
            dataRetirada: null,
            dataDoacao: null,
        }

        addItem(novoItem)

        setFormData(initialFormData)
        setMensagem(`Item ${codigoGerado} cadastrado com sucesso!`)
    }

    return (
        <form className="new-item-form" onSubmit={handleSubmit}>
            {mensagem && (
                <p className="new-item-form__message">
                    {mensagem}
                </p>
            )}

            <div className="new-item-form__group">
                <label htmlFor="nome">Nome do item</label>

                <input
                    id="nome"
                    name="nome"
                    type="text"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Ex.: Carteira preta"
                    required
                />
            </div>

            <div className="new-item-form__row">
                <div className="new-item-form__group">
                    <label htmlFor="categoria">Categoria</label>

                    <select
                        id="categoria"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        required
                    >
                        <option value="">
                            Selecione uma categoria
                        </option>

                        {categories.map((categoria) => (
                            <option
                                key={categoria.id}
                                value={categoria.id}
                            >
                                {categoria.nome}
                            </option>
                        ))}
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
                            !formData.categoria ||
                            subcategoriasDisponiveis.length === 0
                        }
                        required={subcategoriasDisponiveis.length > 0}
                    >
                        <option value="">
                            {!formData.categoria
                                ? "Escolha uma categoria primeiro"
                                : subcategoriasDisponiveis.length === 0
                                    ? "Esta categoria não possui subcategorias"
                                    : "Selecione uma subcategoria"}
                        </option>

                        {subcategoriasDisponiveis.map(
                            (subcategoria) => (
                                <option
                                    key={subcategoria.id}
                                    value={subcategoria.id}
                                >
                                    {subcategoria.nome}
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
                        value={formData.dataEncontrado}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="new-item-form__group">
                    <label htmlFor="fotoUrl">Foto</label>

                    <input
                        id="fotoUrl"
                        name="fotoUrl"
                        type="url"
                        value={formData.fotoUrl}
                        onChange={handleChange}
                        placeholder="URL temporária da imagem"
                    />
                </div>
            </div>

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
                />
            </div>

            <button
                className="new-item-form__submit"
                type="submit"
            >
                Cadastrar item
            </button>
        </form>
    )
}

export default NewItemForm