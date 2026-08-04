import { supabase } from "../lib/supabase"

const TABLE_NAME = "items"

export async function getItems() {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .order("created_at", {
            ascending: false,
        })

    if (error) {
        throw error
    }

    return data ?? []
}

export async function createItem(item) {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert(item)
        .select()
        .single()

    if (error) {
        throw error
    }

    return data
}

export async function updateItem(
    id,
    updatedData
) {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(updatedData)
        .eq("id", id)
        .select()
        .single()

    if (error) {
        throw error
    }

    return data
}

export async function deleteItem(id) {
    const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq("id", id)

    if (error) {
        throw error
    }
}