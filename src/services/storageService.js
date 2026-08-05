import { supabase } from "../lib/supabase"

const BUCKET_NAME = "item-images"

export async function uploadImage(file) {
    if (!file) {
        return null
    }

    const extensao =
        file.name.split(".").pop()?.toLowerCase() || "jpg"

    const nomeArquivo =
        `${crypto.randomUUID()}.${extensao}`

    const caminhoArquivo =
        `items/${nomeArquivo}`

    const { error: uploadError } =
        await supabase.storage
            .from(BUCKET_NAME)
            .upload(caminhoArquivo, file, {
                cacheControl: "3600",
                upsert: false,
                contentType: file.type,
            })

    if (uploadError) {
        throw uploadError
    }

    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(caminhoArquivo)

    return data.publicUrl
}

export async function deleteImage(imageUrl) {
    if (!imageUrl) {
        return
    }

    const marcador =
        `/storage/v1/object/public/${BUCKET_NAME}/`

    const caminhoArquivo =
        imageUrl.split(marcador)[1]

    if (!caminhoArquivo) {
        return
    }

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([caminhoArquivo])

    if (error) {
        throw error
    }
}