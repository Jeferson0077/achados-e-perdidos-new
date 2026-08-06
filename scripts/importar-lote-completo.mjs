import fs from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

import { createClient } from "@supabase/supabase-js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const raizProjeto = path.resolve(__dirname, "..")

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
const email = process.env.SUPABASE_IMPORT_EMAIL
const password = process.env.SUPABASE_IMPORT_PASSWORD

const BUCKET_NAME = "item-images"
const PASTA_RAIZ_FOTOS = path.join(
    raizProjeto,
    "imports"
)

const CAMINHO_MANIFESTO = path.join(
    raizProjeto,
    "manifest-itens.json"
)

const somenteValidar = process.argv.includes("--validar")
const limiteArg = process.argv.find((arg) =>
    arg.startsWith("--limite=")
)
const limite = limiteArg
    ? Number(limiteArg.split("=")[1])
    : null

if (!supabaseUrl || !supabaseKey) {
    console.error(
        "VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY não foram configuradas."
    )
    process.exit(1)
}

if (!somenteValidar && (!email || !password)) {
    console.error(
        "SUPABASE_IMPORT_EMAIL e SUPABASE_IMPORT_PASSWORD não foram configuradas."
    )
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

function contentType(extensao) {
    const tipos = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
    }

    return tipos[extensao.toLowerCase()] ?? "application/octet-stream"
}

function normalizarCaminho(relativo) {
    return relativo.split("/").join(path.sep)
}

async function carregarManifesto() {
    const conteudo = await fs.readFile(
        CAMINHO_MANIFESTO,
        "utf8"
    )

    return JSON.parse(conteudo)
}

async function autenticar() {
    const { error } =
        await supabase.auth.signInWithPassword({
            email,
            password,
        })

    if (error) {
        throw new Error(
            `Falha no login do importador: ${error.message}`
        )
    }
}

async function codigoJaExiste(codigo) {
    const { data, error } = await supabase
        .from("items")
        .select("id")
        .eq("codigo", codigo)
        .maybeSingle()

    if (error) {
        throw error
    }

    return Boolean(data)
}

async function enviarImagem(
    caminhoLocal,
    caminhoStorage
) {
    const arquivo = await fs.readFile(caminhoLocal)
    const extensao = path.extname(caminhoLocal)

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(caminhoStorage, arquivo, {
            contentType: contentType(extensao),
            cacheControl: "3600",
            upsert: false,
        })

    if (error) {
        throw error
    }

    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(caminhoStorage)

    return data.publicUrl
}

async function removerImagem(caminhoStorage) {
    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([caminhoStorage])

    if (error) {
        console.error(
            `Aviso: não foi possível remover ${caminhoStorage}: ${error.message}`
        )
    }
}

async function cadastrarItem(item, fotoUrl) {
    const { error } = await supabase
        .from("items")
        .insert({
            codigo: item.codigo,
            nome: item.nome,
            categoria: item.categoria,
            subcategoria: item.subcategoria,
            observacoes: null,
            status: "ATIVO",
            foto_url: fotoUrl,
            data_encontrado: item.dataEncontrado,
            data_retirada: null,
            data_doacao: null,
        })

    if (error) {
        throw error
    }
}

async function validarArquivos(itens) {
    let encontrados = 0
    let ausentes = 0

    for (const item of itens) {
        if (
            item.statusImportacao !== "PRONTO" ||
            !item.arquivoRelativo
        ) {
            continue
        }

        const caminho = path.join(
            PASTA_RAIZ_FOTOS,
            normalizarCaminho(item.arquivoRelativo)
        )

        try {
            await fs.access(caminho)
            encontrados += 1
        } catch {
            console.error(
                `Arquivo ausente: ${item.codigo} -> ${caminho}`
            )
            ausentes += 1
        }
    }

    console.log("\nValidação concluída:")
    console.log(`Arquivos encontrados: ${encontrados}`)
    console.log(`Arquivos ausentes: ${ausentes}`)

    return ausentes === 0
}

async function importar() {
    const manifesto = await carregarManifesto()
    const prontos = manifesto.filter(
        (item) => item.statusImportacao === "PRONTO"
    )

    const itens = limite
        ? prontos.slice(0, limite)
        : prontos

    const arquivosValidos = await validarArquivos(itens)

    if (somenteValidar) {
        process.exitCode = arquivosValidos ? 0 : 1
        return
    }

    if (!arquivosValidos) {
        throw new Error(
            "Existem arquivos ausentes. Corrija antes de importar."
        )
    }

    await autenticar()
    console.log("\nLogin realizado com sucesso.\n")

    let importados = 0
    let ignorados = 0
    let erros = 0

    for (const item of itens) {
        const caminhoLocal = path.join(
            PASTA_RAIZ_FOTOS,
            normalizarCaminho(item.arquivoRelativo)
        )

        const extensao = path.extname(
            item.arquivoRelativo
        )

        const subpasta = item.subcategoria
            ? `${item.categoria}/${item.subcategoria}`
            : item.categoria

        const caminhoStorage =
            `imports/${subpasta}/${item.codigo}${extensao.toLowerCase()}`

        try {
            if (await codigoJaExiste(item.codigo)) {
                console.log(
                    `↷ ${item.codigo}: já existe. Ignorado.`
                )
                ignorados += 1
                continue
            }

            console.log(
                `Enviando ${item.codigo} — ${item.nome}`
            )

            const fotoUrl = await enviarImagem(
                caminhoLocal,
                caminhoStorage
            )

            try {
                await cadastrarItem(item, fotoUrl)
            } catch (erroCadastro) {
                await removerImagem(caminhoStorage)
                throw erroCadastro
            }

            console.log(`✓ ${item.codigo}`)
            importados += 1
        } catch (error) {
            console.error(
                `✗ ${item.codigo}: ${error.message ?? error}`
            )
            erros += 1
        }
    }

    console.log("\nImportação finalizada:")
    console.log(`Importados: ${importados}`)
    console.log(`Ignorados: ${ignorados}`)
    console.log(`Erros: ${erros}`)
}

importar()
    .catch((error) => {
        console.error(
            `\nFalha geral: ${error.message ?? error}`
        )
        process.exitCode = 1
    })
    .finally(async () => {
        if (!somenteValidar) {
            await supabase.auth.signOut()
        }
    })
