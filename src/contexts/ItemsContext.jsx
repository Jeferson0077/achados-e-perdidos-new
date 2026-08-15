import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"

import { supabase } from "../lib/supabase"

import { deleteImage } from "../services/storageService"
import { ITEM_STATUS } from "../constants/itemStatus"

import {
    createItem,
    deleteItem,
    getItems,
    updateItem as updateItemService,
} from "../services/itemsService"


// ======================================================
// CRIAÇÃO DO CONTEXTO
// ======================================================

// O contexto permite compartilhar os itens entre várias
// páginas/componentes sem precisar passar props manualmente.
const ItemsContext = createContext(null)


// ======================================================
// CONVERSÃO: SUPABASE -> REACT
// ======================================================

// O Supabase trabalha com nomes como:
//
// foto_url
// data_encontrado
// data_retirada
//
// No React estamos usando:
//
// fotoUrl
// dataEncontrado
// dataRetirada
//
// Esta função converte o formato recebido do banco
// para o formato utilizado pela aplicação.
function converterItemDoBanco(item) {
    return {
        id: item.id,

        codigo: item.codigo,
        nome: item.nome,

        categoria: item.categoria,
        subcategoria: item.subcategoria,

        observacoes: item.observacoes,

        status: item.status,

        // Mantemos os dois nomes por compatibilidade
        // com componentes antigos do projeto.
        foto: item.foto_url,
        fotoUrl: item.foto_url,

        data: item.data_encontrado,
        dataEncontrado:
            item.data_encontrado,

        dataRetirada:
            item.data_retirada,

        retiradoPor:
            item.retirado_por,

        matriculaRetirada:
            item.matricula_retirada,

        observacaoRetirada:
            item.observacao_retirada,

        dataDoacao:
            item.data_doacao,

        destinoDoacao:
            item.destino_doacao,

        responsavelDoacao:
            item.responsavel_doacao,

        observacaoDoacao:
            item.observacao_doacao,

        createdAt:
            item.created_at,

        updatedAt:
            item.updated_at,
    }
}


// ======================================================
// CONVERSÃO: REACT -> SUPABASE
// ======================================================

// Faz o caminho contrário.
//
// Recebe um objeto utilizado pelo React e transforma
// somente os campos enviados para o padrão do banco.
//
// Isso é importante porque updateItem pode atualizar
// apenas um campo sem sobrescrever os outros.
function converterItemParaBanco(item) {
    const itemBanco = {}

    if ("codigo" in item) {
        itemBanco.codigo =
            item.codigo
    }

    if ("nome" in item) {
        itemBanco.nome =
            item.nome
    }

    if ("categoria" in item) {
        itemBanco.categoria =
            item.categoria
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
        itemBanco.status =
            item.status
    }

    if (
        "foto" in item ||
        "fotoUrl" in item
    ) {
        itemBanco.foto_url =
            item.fotoUrl ||
            item.foto ||
            null
    }

    if (
        "dataEncontrado" in item ||
        "data" in item
    ) {
        itemBanco.data_encontrado =
            item.dataEncontrado ||
            item.data
    }

    if ("dataRetirada" in item) {
        itemBanco.data_retirada =
            item.dataRetirada || null
    }

    if ("retiradoPor" in item) {
        itemBanco.retirado_por =
            item.retiradoPor || null
    }

    if (
        "matriculaRetirada" in item
    ) {
        itemBanco.matricula_retirada =
            item.matriculaRetirada ||
            null
    }

    if (
        "observacaoRetirada" in item
    ) {
        itemBanco.observacao_retirada =
            item.observacaoRetirada ||
            null
    }

    if ("dataDoacao" in item) {
        itemBanco.data_doacao =
            item.dataDoacao || null
    }

    if ("destinoDoacao" in item) {
        itemBanco.destino_doacao =
            item.destinoDoacao || null
    }

    if (
        "responsavelDoacao" in item
    ) {
        itemBanco.responsavel_doacao =
            item.responsavelDoacao ||
            null
    }

    if (
        "observacaoDoacao" in item
    ) {
        itemBanco.observacao_doacao =
            item.observacaoDoacao ||
            null
    }

    // Toda alteração atualiza a data de modificação.
    itemBanco.updated_at =
        new Date().toISOString()

    return itemBanco
}


// ======================================================
// PROVIDER
// ======================================================

export function ItemsProvider({
    children,
}) {
    // Lista principal de itens utilizada por toda a aplicação.
    const [
        items,
        setItems,
    ] = useState([])

    // Indica se os itens ainda estão sendo carregados.
    const [
        loadingItems,
        setLoadingItems,
    ] = useState(true)

    // Guarda erros relacionados aos itens.
    const [
        itemsError,
        setItemsError,
    ] = useState(null)


    // ==================================================
    // CARREGAMENTO INICIAL DOS ITENS
    // ==================================================

    useEffect(() => {
        async function carregarItens() {
            try {
                setLoadingItems(true)
                setItemsError(null)

                // Busca todos os itens atuais no Supabase.
                const dados =
                    await getItems()

                // Converte cada registro para o formato
                // utilizado pelo React.
                setItems(
                    dados.map(
                        converterItemDoBanco
                    )
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

    // SUPABASE REALTIME

    useEffect(() => {
        // Criamos um canal Realtime.
        //
        // Esse canal ficará ouvindo alterações realizadas
        // na tabela "items".
        const channel = supabase
            .channel("items-realtime")

            .on(
                "postgres_changes",
                {
                    // "*" significa ouvir:
                    //
                    // INSERT
                    // UPDATE
                    // DELETE
                    event: "*",

                    // Schema utilizado pelo Supabase.
                    schema: "public",

                    // Tabela que queremos acompanhar.
                    table: "items",
                },

                (payload) => {
                    console.log(
                        "Realtime evento:",
                        payload.eventType,
                        payload
                    )
                    // O payload informa qual alteração aconteceu
                    // e envia os dados antigos/novos.

                    // ==========================================
                    // NOVO ITEM
                    // ==========================================

                    if (
                        payload.eventType ===
                        "INSERT"
                    ) {
                        const novoItem =
                            converterItemDoBanco(
                                payload.new
                            )

                        setItems(
                            (currentItems) => {
                                // Como addItem também adiciona o item
                                // localmente, podemos receber o mesmo
                                // INSERT pelo Realtime.
                                //
                                // Por isso verificamos se ele já existe.
                                const jaExiste =
                                    currentItems.some(
                                        (item) =>
                                            item.id ===
                                            novoItem.id
                                    )

                                if (jaExiste) {
                                    return currentItems
                                }

                                return [
                                    novoItem,
                                    ...currentItems,
                                ]
                            }
                        )
                    }


                    // ==========================================
                    // ITEM ATUALIZADO
                    // ==========================================

                    if (
                        payload.eventType ===
                        "UPDATE"
                    ) {
                        const itemAtualizado =
                            converterItemDoBanco(
                                payload.new
                            )

                        setItems(
                            (currentItems) =>
                                currentItems.map(
                                    (item) =>
                                        item.id ===
                                            itemAtualizado.id
                                            ? itemAtualizado
                                            : item
                                )
                        )
                    }


                    // ==========================================
                    // ITEM EXCLUÍDO
                    // ==========================================

                    if (
                        payload.eventType ===
                        "DELETE"
                    ) {
                        const itemExcluido =
                            payload.old

                        setItems(
                            (currentItems) =>
                                currentItems.filter(
                                    (item) =>
                                        item.id !==
                                        itemExcluido.id
                                )
                        )
                    }
                }
            )

            // Inicia a conexão com o Realtime.
            .subscribe((status, error) => {
                console.log(
                    "Realtime status:",
                    status
                )

                if (error) {
                    console.error(
                        "Erro no Realtime:",
                        error
                    )
                }
            })


        // Quando o componente for desmontado,
        // removemos o canal.
        //
        // Isso evita conexões duplicadas e vazamento
        // de recursos.
        return () => {
            supabase.removeChannel(
                channel
            )
        }
    }, [])


    // ==================================================
    // CADASTRAR ITEM
    // ==================================================

    async function addItem(newItem) {
        try {
            setItemsError(null)

            const itemParaBanco =
                converterItemParaBanco({
                    ...newItem,

                    // Caso o status não seja enviado,
                    // o item é criado como ATIVO.
                    status:
                        newItem.status ||
                        ITEM_STATUS.ATIVO,
                })

            const itemCriado =
                await createItem(
                    itemParaBanco
                )

            const itemConvertido =
                converterItemDoBanco(
                    itemCriado
                )

            // Atualização imediata no computador
            // que realizou o cadastro.
            //
            // O Realtime também receberá esse INSERT,
            // mas nossa verificação "jaExiste" impede
            // duplicação.
            setItems(
                (currentItems) => {
                    const jaExiste =
                        currentItems.some(
                            (item) =>
                                item.id ===
                                itemConvertido.id
                        )

                    if (jaExiste) {
                        return currentItems
                    }

                    return [
                        itemConvertido,
                        ...currentItems,
                    ]
                }
            )

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


    // ==================================================
    // ATUALIZAR ITEM
    // ==================================================

    async function updateItem(
        itemId,
        updatedData
    ) {
        try {
            setItemsError(null)

            // Converte somente os campos enviados.
            const dadosParaBanco =
                converterItemParaBanco(
                    updatedData
                )

            const itemAtualizado =
                await updateItemService(
                    itemId,
                    dadosParaBanco
                )

            const itemConvertido =
                converterItemDoBanco(
                    itemAtualizado
                )

            // Atualiza imediatamente neste navegador.
            //
            // Outros computadores receberão a mudança
            // através do Realtime.
            setItems(
                (currentItems) =>
                    currentItems.map(
                        (item) =>
                            item.id ===
                                itemId
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


    // ==================================================
    // EXCLUIR ITEM
    // ==================================================

    async function removeItem(itemId) {
        try {
            setItemsError(null)

            // Localizamos o item antes de excluir porque
            // precisaremos da URL da imagem para removê-la.
            const itemSelecionado =
                items.find(
                    (item) =>
                        item.id === itemId
                )

            // Exclui o registro do Supabase.
            await deleteItem(itemId)

            // Se o item possuir foto,
            // removemos também do Storage.
            if (
                itemSelecionado?.fotoUrl ||
                itemSelecionado?.foto
            ) {
                try {
                    await deleteImage(
                        itemSelecionado.fotoUrl ||
                        itemSelecionado.foto
                    )
                } catch (imageError) {
                    console.error(
                        "O item foi excluído, mas não foi possível remover a imagem:",
                        imageError
                    )
                }
            }

            // Remove imediatamente deste navegador.
            //
            // Outros computadores receberão DELETE
            // pelo Realtime.
            setItems(
                (currentItems) =>
                    currentItems.filter(
                        (item) =>
                            item.id !==
                            itemId
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


    // ==================================================
    // CONFIRMAR RETIRADA
    // ==================================================

    async function withdrawItem(
        itemId,
        withdrawalData = {}
    ) {
        // Uma retirada é simplesmente uma atualização
        // do status do item.
        //
        // Como updateItem já atualiza o banco e o estado,
        // não precisamos repetir a lógica.
        return updateItem(itemId, {
            status:
                ITEM_STATUS.RETIRADO,

            dataRetirada:
                new Date().toISOString(),

            ...withdrawalData,
        })
    }


    // ==================================================
    // CONFIRMAR DOAÇÃO
    // ==================================================

    async function donateItem(
        itemId,
        donationData = {}
    ) {
        // Assim como na retirada,
        // a doação apenas altera o status e registra
        // a data/dados da operação.
        return updateItem(itemId, {
            status:
                ITEM_STATUS.DOADO,

            dataDoacao:
                new Date().toISOString(),

            ...donationData,
        })
    }


    // ==================================================
    // DADOS DISPONÍVEIS PARA TODA A APLICAÇÃO
    // ==================================================

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


// ======================================================
// HOOK useItems
// ======================================================

// Esse hook facilita o acesso ao contexto:
//
// const { items, addItem } = useItems()
//
// Também evita usar o contexto fora do ItemsProvider.
export function useItems() {
    const context =
        useContext(ItemsContext)

    if (!context) {
        throw new Error(
            "useItems precisa ser utilizado dentro de ItemsProvider"
        )
    }

    return context
}