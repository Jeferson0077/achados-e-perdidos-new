import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"

import { items as initialItems } from "../data/items"
import { ITEM_STATUS } from "../constants/itemStatus"

const ItemsContext = createContext(null)

export function ItemsProvider({ children }) {
    const [items, setItems] = useState(() => {
        const savedItems = localStorage.getItem(
            "achados-perdidos-items"
        )

        if (savedItems) {
            try {
                return JSON.parse(savedItems)
            } catch {
                return initialItems
            }
        }

        return initialItems
    })

    useEffect(() => {
        localStorage.setItem(
            "achados-perdidos-items",
            JSON.stringify(items)
        )
    }, [items])

    function addItem(newItem) {
        setItems((currentItems) => [
            ...currentItems,
            newItem,
        ])
    }

    function updateItem(itemId, updatedData) {
        setItems((currentItems) =>
            currentItems.map((item) =>
                item.id === itemId
                    ? { ...item, ...updatedData }
                    : item
            )
        )
    }

    function removeItem(itemId) {
        setItems((currentItems) =>
            currentItems.filter(
                (item) => item.id !== itemId
            )
        )
    }

    function withdrawItem(
        itemId,
        withdrawalData = {}
    ) {
        updateItem(itemId, {
            status: ITEM_STATUS.RETIRADO,
            dataRetirada: new Date().toISOString(),
            ...withdrawalData,
        })
    }

    function donateItem(itemId, donationData = {}) {
        updateItem(itemId, {
            status: ITEM_STATUS.DOADO,
            dataDoacao: new Date().toISOString(),
            ...donationData,
        })
    }

    return (
        <ItemsContext.Provider
            value={{
                items,
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