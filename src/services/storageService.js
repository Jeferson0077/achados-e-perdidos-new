import { supabase } from "../lib/supabase"

const BUCKET_NAME = "item-images"

const R2_WORKER_URL =
    "https://achados-perdidos-storage.jeferson-rodriguess007.workers.dev"

const R2_PUBLIC_MARKER =
    ".r2.dev/"


async function getAccessToken() {
    const {
        data: { session },
        error,
    } = await supabase.auth.getSession()

    if (error) {
        throw error
    }

    if (!session?.access_token) {
        throw new Error(
            "Usuário não autenticado"
        )
    }

    return session.access_token
}


export async function uploadImage(
    file
) {
    if (!file) {
        return null
    }

    const accessToken =
        await getAccessToken()

    const formData =
        new FormData()

    formData.append(
        "file",
        file
    )

    const response =
        await fetch(
            `${R2_WORKER_URL}/upload`,
            {
                method: "POST",

                headers: {
                    Authorization:
                        `Bearer ${accessToken}`,
                },

                body: formData,
            }
        )

    if (!response.ok) {
        throw new Error(
            "Erro ao enviar imagem para o R2"
        )
    }

    const data =
        await response.json()

    if (!data.url) {
        throw new Error(
            "O R2 não retornou a URL da imagem"
        )
    }

    return data.url
}


export async function deleteImage(
    imageUrl
) {
    if (!imageUrl) {
        return
    }

    const imagemDoR2 =
        imageUrl.includes(
            R2_PUBLIC_MARKER
        )

    if (imagemDoR2) {
        await deleteR2Image(
            imageUrl
        )

        return
    }

    await deleteSupabaseImage(
        imageUrl
    )
}


async function deleteR2Image(
    imageUrl
) {
    const accessToken =
        await getAccessToken()

    const url =
        new URL(imageUrl)

    const key =
        decodeURIComponent(
            url.pathname.substring(1)
        )

    if (!key) {
        throw new Error(
            "Não foi possível identificar a imagem do R2"
        )
    }

    const response =
        await fetch(
            `${R2_WORKER_URL}/delete`,
            {
                method: "DELETE",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${accessToken}`,
                },

                body:
                    JSON.stringify({
                        key,
                    }),
            }
        )

    if (!response.ok) {
        throw new Error(
            "Erro ao excluir imagem do R2"
        )
    }
}


async function deleteSupabaseImage(
    imageUrl
) {
    const marcador =
        `/storage/v1/object/public/${BUCKET_NAME}/`

    const caminhoArquivo =
        imageUrl.split(
            marcador
        )[1]

    if (!caminhoArquivo) {
        console.warn(
            "Não foi possível identificar o caminho da imagem:",
            imageUrl
        )

        return
    }

    const caminhoDecodificado =
        decodeURIComponent(
            caminhoArquivo
        )

    const { error } =
        await supabase.storage
            .from(BUCKET_NAME)
            .remove([
                caminhoDecodificado,
            ])

    if (error) {
        throw error
    }
}