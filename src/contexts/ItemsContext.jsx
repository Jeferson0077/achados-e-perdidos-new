import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"

import { ITEM_STATUS } from "../constants/itemStatus"

import {
    getItems,
    createItem,
    updateItem as updateItemService,
    deleteItem,
} from "../services/itemsService"

const ItemsContext = createContext(null)

function converterItemDoBanco(item) {
    return {
        id: item.id,
        codigo: item.codigo,
        nome: item.nome,
        categoria: item.categoria,
        subcategoria: item.subcategoria,
        observacoes: item.observacoes,

        status: item.status,

        foto: item.foto_url,
        fotoUrl: item.foto_url,

        data: item.data_encontrado,
        dataEncontrado: item.data_encontrado,

        dataRetirada: item.data_retirada,
        retiradoPor: item.retirado_por,
        matriculaRetirada: item.matricula_retirada,
        observacaoRetirada: item.observacao_retirada,

        dataDoacao: item.data_doacao,
        destinoDoacao: item.destino_doacao,
        responsavelDoacao: item.responsavel_doacao,
        observacaoDoacao: item.observacao_doacao,

        createdAt: item.created_at,
        updatedAt: item.updated_at,
    }
}

function converterItemParaBanco(item) {
    const itemBanco = {}

    if ("codigo" in item) {
        itemBanco.codigo = item.codigo
    }

    if ("nome" in item) {
        itemBanco.nome = item.nome
    }

    if ("categoria" in item) {
        itemBanco.categoria = item.categoria
    }

    if ("subcategoria" in item) {
        itemBanco.subcategoria =
            item.subcategoria || null
    }

    if ("observacoes" in item) {
        itemBanco.observacoes =
            item.observacoes || null
    }

    if ("status" in item) {
        itemBanco.status = item.status
    }

    if ("foto" in item || "fotoUrl" in item) {
        itemBanco.foto_url =
            item.fotoUrl || item.foto || null
    }

    if ("dataEncontrado" in item || "data" in item) {
        itemBanco.data_encontrado =
            item.dataEncontrado || item.data
    }

    if ("dataRetirada" in item) {
        itemBanco.data_retirada =
            item.dataRetirada || null
    }

    if ("retiradoPor" in item) {
        itemBanco.retirado_por =
            item.retiradoPor || null
    }

    if ("matriculaRetirada" in item) {
        itemBanco.matricula_retirada =
            item.matriculaRetirada || null
    }

    if ("observacaoRetirada" in item) {
        itemBanco.observacao_retirada =
            item.observacaoRetirada || null
    }

    if ("dataDoacao" in item) {
        itemBanco.data_doacao =
            item.dataDoacao || null
    }

    if ("destinoDoacao" in item) {
        itemBanco.destino_doacao =
            item.destinoDoacao || null
    }

    if ("responsavelDoacao" in item) {
        itemBanco.responsavel_doacao =
            item.responsavelDoacao || null
    }

    if ("observacaoDoacao" in item) {
        itemBanco.observacao_doacao =
            item.observacaoDoacao || null
    }

    itemBanco.updated_at = new Date().toISOString()

    return itemBanco
}

export function ItemsProvider({ children }) {
    const [items, setItems] = useState([])
    const [loadingItems, setLoadingItems] = useState(true)
    const [itemsError, setItemsError] = useState(null)

    useEffect(() => {
        async function carregarItens() {
            try {
                setLoadingItems(true)
                setItemsError(null)

                const dados = await getItems()

                setItems(
                    dados.map(converterItemDoBanco)
                )
            } catch (error) {
                console.error(
                    "Erro ao carregar itens:",
                    error
                )

                setItemsError(
                    "Não foi possível carregar os itens."
                )
            } finally {
                setLoadingItems(false)
            }
        }

        carregarItens()
    }, [])

    async function addItem(newItem) {
        try {
            setItemsError(null)

            const itemParaBanco =
                converterItemParaBanco({
                    ...newItem,
                    status:
                        newItem.status ||
                        ITEM_STATUS.ATIVO,
                })


            const itemCriado =
                await createItem(itemParaBanco)

            const itemConvertido =
                converterItemDoBanco(itemCriado)

            setItems((currentItems) => [
                itemConvertido,
                ...currentItems,
            ])

            return itemConvertido
        } catch (error) {
            console.error(
                "Erro ao cadastrar item:",
                error
            )

            setItemsError(
                "Não foi possível cadastrar o item."
            )

            throw error
        }
    }

    async function updateItem(
        itemId,
        updatedData
    ) {
        try {
            setItemsError(null)

            const dadosParaBanco =
                converterItemParaBanco(updatedData)

            const itemAtualizado =
                await updateItemService(
                    itemId,
                    dadosParaBanco
                )

            const itemConvertido =
                converterItemDoBanco(
                    itemAtualizado
                )

            setItems((currentItems) =>
                currentItems.map((item) =>
                    item.id === itemId
                        ? itemConvertido
                        : item
                )
            )

            return itemConvertido
        } catch (error) {
            console.error(
                "Erro ao atualizar item:",
                error
            )

            setItemsError(
                "Não foi possível atualizar o item."
            )

            throw error
        }
    }

    async function removeItem(itemId) {
        try {
            setItemsError(null)

            await deleteItem(itemId)

            setItems((currentItems) =>
                currentItems.filter(
                    (item) => item.id !== itemId
                )
            )
        } catch (error) {
            console.error(
                "Erro ao excluir item:",
                error
            )

            setItemsError(
                "Não foi possível excluir o item."
            )

            throw error
        }
    }

    async function withdrawItem(
        itemId,
        withdrawalData = {}
    ) {
        return updateItem(itemId, {
            status: ITEM_STATUS.RETIRADO,
            dataRetirada:
                new Date().toISOString(),
            ...withdrawalData,
        })
    }

    async function donateItem(
        itemId,
        donationData = {}
    ) {
        return updateItem(itemId, {
            status: ITEM_STATUS.DOADO,
            dataDoacao:
                new Date().toISOString(),
            ...donationData,
        })
    }

    return (
        <ItemsContext.Provider
            value={{
                items,
                loadingItems,
                itemsError,
                addItem,
                updateItem,
                removeItem,
                withdrawItem,
                donateItem,
            }}
        >
            {children}
        </ItemsContext.Provider>
    )
}

export function useItems() {
    const context = useContext(ItemsContext)

    if (!context) {
        throw new Error(
            "useItems precisa ser utilizado dentro de ItemsProvider"
        )
    }

    return context
}