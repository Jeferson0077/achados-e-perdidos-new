import {
    useEffect,
    useState,
} from "react"

import {
    FiCamera,
    FiCheckCircle,
    FiEdit2,
    FiFolder,
    FiPackage,
    FiSearch,
    FiSliders,
} from "react-icons/fi"

import { useItems } from "../../contexts/ItemsContext"
import { ITEM_STATUS } from "../../constants/itemStatus"
import { categories } from "../../data/categories"
import AdminLayout from "../../layouts/AdminLayout"

import {
    deleteImage,
    uploadImage,
} from "../../services/storageService"

const initialEditData = {
    nome: "",
    categoria: "",
    subcategoria: "",
    dataEncontrado: "",
    observacoes: "",
}

function ActiveItems() {
    const {
        items,
        updateItem,
        withdrawItem,
    } = useItems()

    // Modal de retirada
    const [
        itemSelecionado,
        setItemSelecionado,
    ] = useState(null)

    const [
        retiradoPor,
        setRetiradoPor,
    ] = useState("")

    const [
        matricula,
        setMatricula,
    ] = useState("")

    const [
        observacaoRetirada,
        setObservacaoRetirada,
    ] = useState("")

    // Modal de edição
    const [
        itemEmEdicao,
        setItemEmEdicao,
    ] = useState(null)

    const [
        dadosEdicao,
        setDadosEdicao,
    ] = useState(initialEditData)

    const [
        novaFoto,
        setNovaFoto,
    ] = useState(null)

    const [
        previewNovaFoto,
        setPreviewNovaFoto,
    ] = useState("")

    const [
        salvandoEdicao,
        setSalvandoEdicao,
    ] = useState(false)

    const [
        mensagemEdicao,
        setMensagemEdicao,
    ] = useState("")

    const [
        erroRetirada,
        setErroRetirada,
    ] = useState("")

    const [
        confirmandoRetirada,
        setConfirmandoRetirada,
    ] = useState(false)

    // Filtros
    const [
        categoriaFiltro,
        setCategoriaFiltro,
    ] = useState("")

    const [
        ordenacao,
        setOrdenacao,
    ] = useState("mais-recentes")

    const [
        pesquisa,
        setPesquisa,
    ] = useState("")


    const categoriaSelecionadaEdicao =
        categories.find(
            (categoria) =>
                categoria.id ===
                dadosEdicao.categoria
        )

    const subcategoriasEdicao =
        categoriaSelecionadaEdicao
            ?.subcategorias ?? []

    useEffect(() => {
        return () => {
            if (previewNovaFoto) {
                URL.revokeObjectURL(
                    previewNovaFoto
                )
            }
        }
    }, [previewNovaFoto])

    function converterData(data) {
        if (!data) {
            return new Date(0)
        }

        if (data.includes("/")) {
            const [dia, mes, ano] =
                data.split("/")

            return new Date(
                Number(ano),
                Number(mes) - 1,
                Number(dia)
            )
        }

        if (data.includes("-")) {
            const dataSemHorario =
                data.split("T")[0]

            const [ano, mes, dia] =
                dataSemHorario.split("-")

            return new Date(
                Number(ano),
                Number(mes) - 1,
                Number(dia)
            )
        }

        return new Date(data)
    }


    const todosItensAtivos = items.filter(
        (item) => {
            const itemAtivo =
                item.status === ITEM_STATUS.ATIVO

            if (!itemAtivo) {
                return false
            }

            const dataEncontrado =
                item.dataEncontrado ||
                item.data

            const dataDoItem =
                converterData(dataEncontrado)

            const hoje = new Date()

            dataDoItem.setHours(0, 0, 0, 0)
            hoje.setHours(0, 0, 0, 0)

            const dias =
                Math.floor(
                    (hoje - dataDoItem) /
                    (1000 * 60 * 60 * 24)
                )

            return dias < 60
        }
    )

    const categoriasDisponiveis = [
        ...new Set(
            todosItensAtivos
                .map((item) => item.categoria)
                .filter(Boolean)
        ),
    ].sort((categoriaA, categoriaB) =>
        categoriaA.localeCompare(
            categoriaB,
            "pt-BR"
        )
    )

    function formatarData(data) {
        if (!data) {
            return "Data não informada"
        }

        if (data.includes("/")) {
            return data
        }

        if (data.includes("-")) {
            const dataSemHorario =
                data.split("T")[0]

            const [ano, mes, dia] =
                dataSemHorario.split("-")

            return `${dia}/${mes}/${ano}`
        }

        return data
    }

    function prepararDataParaInput(data) {
        if (!data) {
            return ""
        }

        if (data.includes("-")) {
            return data.split("T")[0]
        }

        if (data.includes("/")) {
            const [dia, mes, ano] =
                data.split("/")

            return `${ano}-${mes.padStart(
                2,
                "0"
            )}-${dia.padStart(2, "0")}`
        }

        return ""
    }

    function obterNomeCategoria(
        categoriaId
    ) {
        return (
            categories.find(
                (categoria) =>
                    categoria.id === categoriaId
            )?.nome || categoriaId
        )
    }

    function obterNomeSubcategoria(
        categoriaId,
        subcategoriaId
    ) {
        if (!subcategoriaId) {
            return ""
        }

        const categoria = categories.find(
            (item) =>
                item.id === categoriaId
        )

        return (
            categoria?.subcategorias.find(
                (subcategoria) =>
                    subcategoria.id ===
                    subcategoriaId
            )?.nome || subcategoriaId
        )
    }

    const itensAtivos = todosItensAtivos
        .filter((item) => {
            const termoPesquisa = pesquisa
                .trim()
                .toLowerCase()

            const correspondeCategoria =
                !categoriaFiltro ||
                item.categoria ===
                categoriaFiltro

            const correspondePesquisa =
                !termoPesquisa ||
                item.nome
                    ?.toLowerCase()
                    .includes(termoPesquisa) ||
                item.codigo
                    ?.toLowerCase()
                    .includes(termoPesquisa)

            return (
                correspondeCategoria &&
                correspondePesquisa
            )
        })
        .sort((itemA, itemB) => {
            const dataA = converterData(
                itemA.dataEncontrado ||
                itemA.data
            )

            const dataB = converterData(
                itemB.dataEncontrado ||
                itemB.data
            )

            if (
                ordenacao === "mais-antigos"
            ) {
                return dataA - dataB
            }

            if (ordenacao === "nome-az") {
                return (
                    itemA.nome || ""
                ).localeCompare(
                    itemB.nome || "",
                    "pt-BR"
                )
            }

            if (ordenacao === "nome-za") {
                return (
                    itemB.nome || ""
                ).localeCompare(
                    itemA.nome || "",
                    "pt-BR"
                )
            }

            return dataB - dataA
        })

    // ============================
    // RETIRADA
    // ============================

    function abrirModalRetirada(item) {
        fecharModalEdicao()

        setItemSelecionado(item)
        setRetiradoPor("")
        setMatricula("")
        setObservacaoRetirada("")
        setErroRetirada("")
    }

    function fecharModalRetirada() {
        if (confirmandoRetirada) {
            return
        }

        setItemSelecionado(null)
        setRetiradoPor("")
        setMatricula("")
        setObservacaoRetirada("")
        setErroRetirada("")
    }

    async function handleConfirmarRetirada(
        event
    ) {
        event.preventDefault()

        if (!itemSelecionado) {
            return
        }

        if (!retiradoPor.trim()) {
            setErroRetirada(
                "Informe o nome de quem retirou."
            )
            return
        }

        if (!matricula.trim()) {
            setErroRetirada(
                "Informe a matrícula."
            )
            return
        }

        try {
            setConfirmandoRetirada(true)
            setErroRetirada("")

            await withdrawItem(
                itemSelecionado.id,
                {
                    retiradoPor:
                        retiradoPor.trim(),

                    matriculaRetirada:
                        matricula.trim(),

                    observacaoRetirada:
                        observacaoRetirada.trim(),
                }
            )

            setItemSelecionado(null)
            setRetiradoPor("")
            setMatricula("")
            setObservacaoRetirada("")
        } catch (error) {
            console.error(
                "Erro ao confirmar retirada:",
                error
            )

            setErroRetirada(
                "Não foi possível confirmar a retirada."
            )
        } finally {
            setConfirmandoRetirada(false)
        }
    }

    // ============================
    // EDIÇÃO
    // ============================

    function abrirModalEdicao(item) {
        fecharModalRetirada()

        setItemEmEdicao(item)

        setDadosEdicao({
            nome: item.nome || "",
            categoria:
                item.categoria || "",
            subcategoria:
                item.subcategoria || "",

            dataEncontrado:
                prepararDataParaInput(
                    item.dataEncontrado ||
                    item.data
                ),

            observacoes:
                item.observacoes || "",
        })

        setNovaFoto(null)
        setPreviewNovaFoto("")
        setMensagemEdicao("")
    }

    function fecharModalEdicao() {
        if (salvandoEdicao) {
            return
        }

        if (previewNovaFoto) {
            URL.revokeObjectURL(
                previewNovaFoto
            )
        }

        setItemEmEdicao(null)
        setDadosEdicao(initialEditData)
        setNovaFoto(null)
        setPreviewNovaFoto("")
        setMensagemEdicao("")
    }

    function handleEdicaoChange(event) {
        const {
            name,
            value,
        } = event.target

        setDadosEdicao(
            (dadosAtuais) => ({
                ...dadosAtuais,
                [name]: value,

                ...(name ===
                    "categoria" && {
                    subcategoria: "",
                }),
            })
        )

        setMensagemEdicao("")
    }

    function handleNovaFotoChange(event) {
        const arquivo =
            event.target.files?.[0]

        if (!arquivo) {
            return
        }

        if (
            !arquivo.type.startsWith(
                "image/"
            )
        ) {
            setMensagemEdicao(
                "Selecione um arquivo de imagem válido."
            )

            event.target.value = ""
            return
        }

        const tamanhoMaximo =
            5 * 1024 * 1024

        if (
            arquivo.size > tamanhoMaximo
        ) {
            setMensagemEdicao(
                "A imagem deve ter no máximo 5 MB."
            )

            event.target.value = ""
            return
        }

        if (previewNovaFoto) {
            URL.revokeObjectURL(
                previewNovaFoto
            )
        }

        setNovaFoto(arquivo)

        setPreviewNovaFoto(
            URL.createObjectURL(arquivo)
        )

        setMensagemEdicao("")
    }

    function removerNovaFoto() {
        if (previewNovaFoto) {
            URL.revokeObjectURL(
                previewNovaFoto
            )
        }

        setNovaFoto(null)
        setPreviewNovaFoto("")

        const inputFoto =
            document.getElementById(
                "editar-foto"
            )

        if (inputFoto) {
            inputFoto.value = ""
        }
    }

    async function handleSalvarEdicao(
        event
    ) {
        event.preventDefault()

        if (!itemEmEdicao) {
            return
        }

        const nomeLimpo =
            dadosEdicao.nome.trim()

        if (!nomeLimpo) {
            setMensagemEdicao(
                "Informe o nome do item."
            )
            return
        }

        if (!dadosEdicao.categoria) {
            setMensagemEdicao(
                "Selecione uma categoria."
            )
            return
        }

        if (
            subcategoriasEdicao.length >
            0 &&
            !dadosEdicao.subcategoria
        ) {
            setMensagemEdicao(
                "Selecione uma subcategoria."
            )
            return
        }

        if (
            !dadosEdicao.dataEncontrado
        ) {
            setMensagemEdicao(
                "Informe a data encontrada."
            )
            return
        }

        let novaFotoUrl = null

        const fotoAntiga =
            itemEmEdicao.fotoUrl ||
            itemEmEdicao.foto

        try {
            setSalvandoEdicao(true)
            setMensagemEdicao("")

            if (novaFoto) {
                novaFotoUrl =
                    await uploadImage(
                        novaFoto
                    )
            }

            await updateItem(
                itemEmEdicao.id,
                {
                    nome: nomeLimpo,

                    categoria:
                        dadosEdicao.categoria,

                    subcategoria:
                        dadosEdicao.subcategoria ||
                        null,

                    dataEncontrado:
                        dadosEdicao.dataEncontrado,

                    observacoes:
                        dadosEdicao.observacoes.trim(),

                    ...(novaFotoUrl && {
                        fotoUrl: novaFotoUrl,
                    }),
                }
            )

            if (
                novaFotoUrl &&
                fotoAntiga &&
                fotoAntiga !== novaFotoUrl
            ) {
                try {
                    await deleteImage(
                        fotoAntiga
                    )
                } catch (error) {
                    console.error(
                        "Item atualizado, mas não foi possível remover a foto antiga:",
                        error
                    )
                }
            }

            if (previewNovaFoto) {
                URL.revokeObjectURL(
                    previewNovaFoto
                )
            }

            setItemEmEdicao(null)
            setDadosEdicao(
                initialEditData
            )
            setNovaFoto(null)
            setPreviewNovaFoto("")
            setMensagemEdicao("")
        } catch (error) {
            console.error(
                "Erro ao editar item:",
                error
            )

            if (novaFotoUrl) {
                try {
                    await deleteImage(
                        novaFotoUrl
                    )
                } catch (deleteError) {
                    console.error(
                        "Erro ao remover a nova foto após falha:",
                        deleteError
                    )
                }
            }

            setMensagemEdicao(
                "Não foi possível atualizar o item."
            )
        } finally {
            setSalvandoEdicao(false)
        }
    }

    function limparFiltros() {
        setPesquisa("")
        setCategoriaFiltro("")
        setOrdenacao(
            "mais-recentes"
        )
    }

    return (
        <AdminLayout>
            <section className="admin-page">
                <div className="admin-page__header">
                    <div>
                        <h2>
                            Itens Ativos
                        </h2>

                        <p>
                            Visualize, edite e
                            confirme a retirada dos
                            objetos encontrados.
                        </p>
                    </div>

                    <span className="admin-page__count">
                        {
                            todosItensAtivos.length
                        }

                        {todosItensAtivos.length ===
                            1
                            ? " item ativo"
                            : " itens ativos"}
                    </span>
                </div>

                <div className="active-items__toolbar">
                    <div className="active-items__filters">
                        <label className="active-items__filter active-items__filter--search">
                            <span className="active-items__filter-label">
                                <FiSearch />
                                Pesquisar
                            </span>

                            <input
                                type="search"
                                value={
                                    pesquisa
                                }
                                onChange={(
                                    event
                                ) =>
                                    setPesquisa(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Nome ou código do item"
                            />
                        </label>

                        <label className="active-items__filter">
                            <span className="active-items__filter-label">
                                <FiFolder />
                                Categoria
                            </span>

                            <select
                                value={
                                    categoriaFiltro
                                }
                                onChange={(
                                    event
                                ) =>
                                    setCategoriaFiltro(
                                        event
                                            .target
                                            .value
                                    )
                                }
                            >
                                <option value="">
                                    Todas as
                                    categorias
                                </option>

                                {categoriasDisponiveis.map(
                                    (
                                        categoria
                                    ) => (
                                        <option
                                            key={
                                                categoria
                                            }
                                            value={
                                                categoria
                                            }
                                        >
                                            {obterNomeCategoria(
                                                categoria
                                            )}
                                        </option>
                                    )
                                )}
                            </select>
                        </label>

                        <label className="active-items__filter">
                            <span className="active-items__filter-label">
                                <FiSliders />
                                Ordenar por
                            </span>

                            <select
                                value={
                                    ordenacao
                                }
                                onChange={(
                                    event
                                ) =>
                                    setOrdenacao(
                                        event
                                            .target
                                            .value
                                    )
                                }
                            >
                                <option value="mais-recentes">
                                    Mais recentes
                                </option>

                                <option value="mais-antigos">
                                    Mais antigos
                                </option>

                                <option value="nome-az">
                                    Nome de A a Z
                                </option>

                                <option value="nome-za">
                                    Nome de Z a A
                                </option>
                            </select>
                        </label>
                    </div>

                    <p className="active-items__results">
                        Exibindo{" "}
                        <strong>
                            {
                                itensAtivos.length
                            }
                        </strong>{" "}
                        de{" "}
                        <strong>
                            {
                                todosItensAtivos.length
                            }
                        </strong>{" "}
                        {todosItensAtivos.length ===
                            1
                            ? "item"
                            : "itens"}
                    </p>
                </div>

                {itensAtivos.length ===
                    0 ? (
                    <div className="active-items__empty">
                        <span>
                            <FiPackage />
                        </span>

                        <h3>
                            {todosItensAtivos.length ===
                                0
                                ? "Nenhum item ativo"
                                : "Nenhum item encontrado"}
                        </h3>

                        <p>
                            {todosItensAtivos.length ===
                                0
                                ? "Os novos objetos cadastrados aparecerão nesta página."
                                : "Não há itens ativos que correspondam aos filtros selecionados."}
                        </p>

                        {todosItensAtivos.length >
                            0 && (
                                <button
                                    className="active-items__clear-filters"
                                    type="button"
                                    onClick={
                                        limparFiltros
                                    }
                                >
                                    Limpar filtros
                                </button>
                            )}
                    </div>
                ) : (
                    <div className="active-items__grid">
                        {itensAtivos.map(
                            (item) => (
                                <article
                                    className="active-item-card"
                                    key={
                                        item.id
                                    }
                                >
                                    <div className="active-item-card__image">
                                        {item.foto ||
                                            item.fotoUrl ? (
                                            <img
                                                src={
                                                    item.foto ||
                                                    item.fotoUrl
                                                }
                                                alt={
                                                    item.nome
                                                }
                                            />
                                        ) : (
                                            <span />
                                        )}
                                    </div>

                                    <div className="active-item-card__content">
                                        <div className="active-item-card__top">
                                            <span className="active-item-card__code">
                                                {
                                                    item.codigo
                                                }
                                            </span>

                                            <span className="active-item-card__status">
                                                Ativo
                                            </span>
                                        </div>

                                        <h3>
                                            {
                                                item.nome
                                            }
                                        </h3>

                                        <p>
                                            <strong>
                                                Categoria:
                                            </strong>{" "}
                                            {obterNomeCategoria(
                                                item.categoria
                                            )}
                                        </p>

                                        {item.subcategoria && (
                                            <p>
                                                <strong>
                                                    Subcategoria:
                                                </strong>{" "}
                                                {obterNomeSubcategoria(
                                                    item.categoria,
                                                    item.subcategoria
                                                )}
                                            </p>
                                        )}

                                        <p>
                                            <strong>
                                                Encontrado
                                                em:
                                            </strong>{" "}
                                            {formatarData(
                                                item.dataEncontrado ||
                                                item.data
                                            )}
                                        </p>

                                        {item.observacoes && (
                                            <p className="active-item-card__observations">
                                                {
                                                    item.observacoes
                                                }
                                            </p>
                                        )}

                                        <div className="active-item-card__actions">
                                            <button
                                                className="active-item-card__edit"
                                                type="button"
                                                onClick={() =>
                                                    abrirModalEdicao(
                                                        item
                                                    )
                                                }
                                            >
                                                <FiEdit2 />
                                                Editar
                                                item
                                            </button>

                                            <button
                                                className="active-item-card__withdraw"
                                                type="button"
                                                onClick={() =>
                                                    abrirModalRetirada(
                                                        item
                                                    )
                                                }
                                            >
                                                <FiCheckCircle />
                                                Confirmar
                                                retirada
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            )
                        )}
                    </div>
                )}
            </section>

            {/* MODAL DE EDIÇÃO */}
            {itemEmEdicao && (
                <div
                    className="withdraw-modal__overlay"
                    onMouseDown={
                        fecharModalEdicao
                    }
                >
                    <div
                        className="withdraw-modal edit-item-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-modal-title"
                        onMouseDown={(
                            event
                        ) =>
                            event.stopPropagation()
                        }
                    >
                        <button
                            className="withdraw-modal__close"
                            type="button"
                            aria-label="Fechar edição"
                            onClick={
                                fecharModalEdicao
                            }
                            disabled={
                                salvandoEdicao
                            }
                        >
                            ×
                        </button>

                        <div className="withdraw-modal__header">
                            <FiEdit2 />

                            <div>
                                <h2 id="edit-modal-title">
                                    Editar item
                                </h2>

                                <p>
                                    Altere os dados
                                    cadastrados para
                                    este objeto.
                                </p>
                            </div>
                        </div>

                        <div className="withdraw-modal__item">
                            <div>
                                <span>
                                    Item
                                </span>

                                <strong>
                                    {
                                        itemEmEdicao.nome
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Código
                                </span>

                                <strong>
                                    {
                                        itemEmEdicao.codigo
                                    }
                                </strong>
                            </div>
                        </div>

                        <form
                            className="withdraw-modal__form"
                            onSubmit={
                                handleSalvarEdicao
                            }
                        >
                            {mensagemEdicao && (
                                <p
                                    className="new-item-form__message new-item-form__message--erro"
                                    role="alert"
                                >
                                    {
                                        mensagemEdicao
                                    }
                                </p>
                            )}

                            <label>
                                Nome do item

                                <input
                                    name="nome"
                                    type="text"
                                    value={
                                        dadosEdicao.nome
                                    }
                                    onChange={
                                        handleEdicaoChange
                                    }
                                    required
                                    disabled={
                                        salvandoEdicao
                                    }
                                />
                            </label>

                            <label>
                                Categoria

                                <select
                                    name="categoria"
                                    value={
                                        dadosEdicao.categoria
                                    }
                                    onChange={
                                        handleEdicaoChange
                                    }
                                    required
                                    disabled={
                                        salvandoEdicao
                                    }
                                >
                                    <option value="">
                                        Selecione uma
                                        categoria
                                    </option>

                                    {categories.map(
                                        (
                                            categoria
                                        ) => (
                                            <option
                                                key={
                                                    categoria.id
                                                }
                                                value={
                                                    categoria.id
                                                }
                                            >
                                                {
                                                    categoria.nome
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </label>

                            <label>
                                Subcategoria

                                <select
                                    name="subcategoria"
                                    value={
                                        dadosEdicao.subcategoria
                                    }
                                    onChange={
                                        handleEdicaoChange
                                    }
                                    disabled={
                                        salvandoEdicao ||
                                        !dadosEdicao.categoria ||
                                        subcategoriasEdicao.length ===
                                        0
                                    }
                                    required={
                                        subcategoriasEdicao.length >
                                        0
                                    }
                                >
                                    <option value="">
                                        {!dadosEdicao.categoria
                                            ? "Escolha uma categoria primeiro"
                                            : subcategoriasEdicao.length ===
                                                0
                                                ? "Esta categoria não possui subcategorias"
                                                : "Selecione uma subcategoria"}
                                    </option>

                                    {subcategoriasEdicao.map(
                                        (
                                            subcategoria
                                        ) => (
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
                            </label>

                            <label>
                                Data encontrada

                                <input
                                    name="dataEncontrado"
                                    type="date"
                                    value={
                                        dadosEdicao.dataEncontrado
                                    }
                                    onChange={
                                        handleEdicaoChange
                                    }
                                    required
                                    disabled={
                                        salvandoEdicao
                                    }
                                />
                            </label>

                            <label>
                                Observações

                                <textarea
                                    name="observacoes"
                                    value={
                                        dadosEdicao.observacoes
                                    }
                                    onChange={
                                        handleEdicaoChange
                                    }
                                    rows="4"
                                    disabled={
                                        salvandoEdicao
                                    }
                                />
                            </label>

                            <div className="edit-item-modal__photo">
                                <span>
                                    Foto do item
                                </span>

                                <label
                                    className="new-item-form__photo-button"
                                    htmlFor="editar-foto"
                                >
                                    <FiCamera />

                                    {novaFoto
                                        ? "Escolher outra foto"
                                        : "Trocar foto"}
                                </label>

                                <input
                                    id="editar-foto"
                                    className="new-item-form__photo-input"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    capture="environment"
                                    onChange={
                                        handleNovaFotoChange
                                    }
                                    disabled={
                                        salvandoEdicao
                                    }
                                />

                                {novaFoto && (
                                    <button
                                        className="edit-item-modal__remove-photo"
                                        type="button"
                                        onClick={
                                            removerNovaFoto
                                        }
                                        disabled={
                                            salvandoEdicao
                                        }
                                    >
                                        Manter foto
                                        anterior
                                    </button>
                                )}
                            </div>

                            <div className="edit-item-modal__preview">
                                <img
                                    src={
                                        previewNovaFoto ||
                                        itemEmEdicao.fotoUrl ||
                                        itemEmEdicao.foto
                                    }
                                    alt="Foto do item"
                                />
                            </div>

                            <div className="withdraw-modal__actions">
                                <button
                                    className="withdraw-modal__cancel"
                                    type="button"
                                    onClick={
                                        fecharModalEdicao
                                    }
                                    disabled={
                                        salvandoEdicao
                                    }
                                >
                                    Cancelar
                                </button>

                                <button
                                    className="withdraw-modal__confirm"
                                    type="submit"
                                    disabled={
                                        salvandoEdicao
                                    }
                                >
                                    {salvandoEdicao
                                        ? "Salvando..."
                                        : "Salvar alterações"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DE RETIRADA */}
            {itemSelecionado && (
                <div
                    className="withdraw-modal__overlay"
                    onMouseDown={
                        fecharModalRetirada
                    }
                >
                    <div
                        className="withdraw-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="withdraw-modal-title"
                        onMouseDown={(
                            event
                        ) =>
                            event.stopPropagation()
                        }
                    >
                        <button
                            className="withdraw-modal__close"
                            type="button"
                            aria-label="Fechar modal"
                            onClick={
                                fecharModalRetirada
                            }
                            disabled={
                                confirmandoRetirada
                            }
                        >
                            ×
                        </button>

                        <div className="withdraw-modal__header">
                            <FiCheckCircle />

                            <div>
                                <h2 id="withdraw-modal-title">
                                    Confirmar
                                    retirada
                                </h2>

                                <p>
                                    Registre os
                                    dados de quem
                                    está retirando
                                    o objeto.
                                </p>
                            </div>
                        </div>

                        <div className="withdraw-modal__item">
                            <div>
                                <span>
                                    Item
                                </span>

                                <strong>
                                    {
                                        itemSelecionado.nome
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Código
                                </span>

                                <strong>
                                    {
                                        itemSelecionado.codigo
                                    }
                                </strong>
                            </div>
                        </div>

                        <form
                            className="withdraw-modal__form"
                            onSubmit={
                                handleConfirmarRetirada
                            }
                        >
                            {erroRetirada && (
                                <p
                                    className="new-item-form__message new-item-form__message--erro"
                                    role="alert"
                                >
                                    {
                                        erroRetirada
                                    }
                                </p>
                            )}

                            <label>
                                Nome de quem
                                retirou

                                <input
                                    type="text"
                                    value={
                                        retiradoPor
                                    }
                                    onChange={(
                                        event
                                    ) => {
                                        setRetiradoPor(
                                            event
                                                .target
                                                .value
                                        )

                                        setErroRetirada(
                                            ""
                                        )
                                    }}
                                    placeholder="Digite o nome completo"
                                    required
                                    autoFocus
                                    disabled={
                                        confirmandoRetirada
                                    }
                                />
                            </label>

                            <label>
                                Matrícula

                                <input
                                    type="text"
                                    value={
                                        matricula
                                    }
                                    onChange={(
                                        event
                                    ) => {
                                        setMatricula(
                                            event
                                                .target
                                                .value
                                        )

                                        setErroRetirada(
                                            ""
                                        )
                                    }}
                                    placeholder="Digite a matrícula"
                                    required
                                    disabled={
                                        confirmandoRetirada
                                    }
                                />
                            </label>

                            <label>
                                Observações da
                                retirada

                                <textarea
                                    value={
                                        observacaoRetirada
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setObservacaoRetirada(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Informações adicionais, se necessário"
                                    rows="4"
                                    disabled={
                                        confirmandoRetirada
                                    }
                                />
                            </label>

                            <div className="withdraw-modal__actions">
                                <button
                                    className="withdraw-modal__cancel"
                                    type="button"
                                    onClick={
                                        fecharModalRetirada
                                    }
                                    disabled={
                                        confirmandoRetirada
                                    }
                                >
                                    Cancelar
                                </button>

                                <button
                                    className="withdraw-modal__confirm"
                                    type="submit"
                                    disabled={
                                        confirmandoRetirada
                                    }
                                >
                                    {confirmandoRetirada
                                        ? "Confirmando..."
                                        : "Confirmar retirada"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}

export default ActiveItems