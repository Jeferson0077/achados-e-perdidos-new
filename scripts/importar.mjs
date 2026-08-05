import fs from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

import { createClient } from "@supabase/supabase-js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const raizProjeto = path.resolve(__dirname, "..")

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY

const email = process.env.SUPABASE_IMPORT_EMAIL
const password = process.env.SUPABASE_IMPORT_PASSWORD

const BUCKET_NAME = "item-images"

const categoriaInformada =
    process.argv[2]?.trim().toLowerCase()

if (!categoriaInformada) {
    console.error(
        "Informe a categoria. Exemplo: node scripts/importar.mjs academia"
    )

    process.exit(1)
}

if (
    !supabaseUrl ||
    !supabaseKey ||
    !email ||
    !password
) {
    console.error(
        "As variáveis do Supabase ou do usuário de importação não foram configuradas."
    )

    process.exit(1)
}

const supabase = createClient(
    supabaseUrl,
    supabaseKey
)

const configuracoes = {
    academia: {
        categoria: "academia",
        subcategoria: null,
        pasta: "academia",
        itens: {
            "1360": {
                nome: "Faixa elástica vermelha",
                dataEncontrado: "2026-04-14",
            },
            "1512": {
                nome: "Luva preta Trainer",
                dataEncontrado: "2026-04-24",
            },
            "1531": {
                nome: "Munhequeira preta Pro Tec",
                dataEncontrado: "2026-04-25",
            },
            "1843": {
                nome: "Munhequeira preta",
                dataEncontrado: "2026-05-18",
            },
            "2162": {
                nome: "Luva fitness preta",
                dataEncontrado: "2026-06-10",
            },
            "2177": {
                nome: "Joelheira vermelha",
                dataEncontrado: "2026-06-11",
            },
            "2330": {
                nome: "Joelheira azul e cinza",
                dataEncontrado: "2026-06-22",
            },
            "2372": {
                nome: "Faixa elástica preta",
                dataEncontrado: "2026-06-25",
            },
            "2409": {
                nome: "Faixa elástica preta e rosa",
                dataEncontrado: "2026-06-29",
            },
        },
    },
}

const configuracao =
    configuracoes[categoriaInformada]

if (!configuracao) {
    console.error(
        `A categoria "${categoriaInformada}" ainda não está configurada no importador.`
    )

    process.exit(1)
}

function descobrirContentType(extensao) {
    const tipos = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
    }

    return tipos[extensao] ?? "application/octet-stream"
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

    console.log("Login realizado com sucesso.\n")
}

async function codigoJaExiste(codigo) {
    const { data, error } = await supabase
        .from("items")
        .select("id, codigo")
        .eq("codigo", codigo)
        .maybeSingle()

    if (error) {
        throw error
    }

    return Boolean(data)
}

async function enviarImagem({
    caminhoLocal,
    caminhoStorage,
    contentType,
}) {
    const arquivo = await fs.readFile(caminhoLocal)

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(caminhoStorage, arquivo, {
            contentType,
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

async function excluirImagem(caminhoStorage) {
    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([caminhoStorage])

    if (error) {
        console.error(
            `Não foi possível remover a imagem ${caminhoStorage}:`,
            error.message
        )
    }
}

async function cadastrarItem(item) {
    const { error } = await supabase
        .from("items")
        .insert({
            codigo: item.codigo,
            nome: item.nome,
            categoria: item.categoria,
            subcategoria: item.subcategoria,
            observacoes: null,
            status: "ATIVO",
            foto_url: item.fotoUrl,
            data_encontrado: item.dataEncontrado,
            data_retirada: null,
            data_doacao: null,
        })

    if (error) {
        throw error
    }
}

async function importar() {
    await autenticar()

    const pastaImagens = path.join(
        raizProjeto,
        "imports",
        configuracao.pasta
    )

    const arquivos = await fs.readdir(
        pastaImagens,
        {
            withFileTypes: true,
        }
    )

    const imagens = arquivos
        .filter((arquivo) => arquivo.isFile())
        .map((arquivo) => arquivo.name)
        .filter((nome) =>
            /\.(jpe?g|png|webp)$/i.test(nome)
        )
        .sort((a, b) =>
            a.localeCompare(b, "pt-BR", {
                numeric: true,
            })
        )

    if (imagens.length === 0) {
        console.log(
            `Nenhuma imagem encontrada em ${pastaImagens}.`
        )

        return
    }

    let importados = 0
    let ignorados = 0
    let erros = 0

    for (const nomeArquivo of imagens) {
        const extensao =
            path.extname(nomeArquivo).toLowerCase()

        const codigo = path.basename(
            nomeArquivo,
            extensao
        )

        const dadosItem =
            configuracao.itens[codigo]

        if (!dadosItem) {
            console.log(
                `⚠ ${codigo}: não possui dados configurados. Ignorado.`
            )

            ignorados += 1
            continue
        }

        try {
            const jaExiste =
                await codigoJaExiste(codigo)

            if (jaExiste) {
                console.log(
                    `↷ ${codigo}: já existe no banco. Ignorado.`
                )

                ignorados += 1
                continue
            }

            const caminhoLocal = path.join(
                pastaImagens,
                nomeArquivo
            )

            const caminhoStorage =
                `imports/${configuracao.pasta}/${nomeArquivo}`

            console.log(
                `Enviando ${codigo}...`
            )

            const fotoUrl = await enviarImagem({
                caminhoLocal,
                caminhoStorage,
                contentType:
                    descobrirContentType(extensao),
            })

            try {
                await cadastrarItem({
                    codigo,
                    nome: dadosItem.nome,
                    categoria:
                        configuracao.categoria,
                    subcategoria:
                        configuracao.subcategoria,
                    dataEncontrado:
                        dadosItem.dataEncontrado,
                    fotoUrl,
                })
            } catch (errorCadastro) {
                await excluirImagem(
                    caminhoStorage
                )

                throw errorCadastro
            }

            console.log(
                `✓ ${codigo}: ${dadosItem.nome}`
            )

            importados += 1
        } catch (error) {
            console.error(
                `✗ ${codigo}:`,
                error.message ?? error
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
            "\nFalha geral na importação:",
            error.message ?? error
        )

        process.exitCode = 1
    })
    .finally(async () => {
        await supabase.auth.signOut()
    })