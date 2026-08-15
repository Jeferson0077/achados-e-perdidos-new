// ========================================
// CATEGORIAS PRINCIPAIS
// ========================================

import academiaIcon from "../assets/icons/white/01-academia.svg"
import banhoIcon from "../assets/icons/white/02-banho-cuidados.svg"
import bonesIcon from "../assets/icons/white/03-bones-viseiras-capacetes.svg"
import brinquedosIcon from "../assets/icons/white/04-brinquedos.svg"
import calcadosIcon from "../assets/icons/white/05-calcados-chinelos.svg"
import eletronicosIcon from "../assets/icons/white/06-eletronicos-equipamentos.svg"
import futebolIcon from "../assets/icons/white/07-futebol.svg"
import mochilasIcon from "../assets/icons/white/08-mochilas-bolsas-sacolas.svg"
import oculosIcon from "../assets/icons/white/09-oculos.svg"
import tenisIcon from "../assets/icons/white/10-tenis-raquetes.svg"
import remediosIcon from "../assets/icons/white/11-remedios.svg"
import squeezesIcon from "../assets/icons/white/12-garrafas-copos.svg"
import vestuarioIcon from "../assets/icons/white/13-vestuario.svg"
import infantilIcon from "../assets/icons/white/14-bebes-infantil.svg"
import livrosIcon from "../assets/icons/white/15-material-escolar-livros.svg"
import alimenticiosIcon from "../assets/icons/white/16-alimenticios-vaper.svg"
import carteirasIcon from "../assets/icons/white/17-carteiras-documentos-cartoes.svg"
import chavesIcon from "../assets/icons/white/18-guarda-chuvas-chaves-fitas.svg"
import pulseirasIcon from "../assets/icons/white/19-pulseiras-colares-brincos.svg"
import cachorroIcon from "../assets/icons/white/20-acessorios-cachorro.svg"
import skateIcon from "../assets/icons/white/21-skates.svg"
import cobertoresIcon from "../assets/icons/white/22-cobertores-cachecol-tapetes-almofada.svg"
import semCategoriaIcon from "../assets/icons/white/23-sem-categoria.svg"

// ========================================
// SUBCATEGORIAS — BANHOS E CUIDADOS
// ========================================

import soapIcon from "../assets/icons/white/banho-esponjas-sabonetes.svg"
import combIcon from "../assets/icons/white/banho-pentes-escovas.svg"
import shampooIcon from "../assets/icons/white/banho-shampoo-condicionador.svg"
import towelIcon from "../assets/icons/white/banho-toalhas-mantas-roupao.svg"
import razorIcon from "../assets/icons/white/banho-itens-barbear.svg"
import buoyIcon from "../assets/icons/white/banho-boias.svg"
import makeupIcon from "../assets/icons/white/banho-estojos-maquiagem-pincas.svg"
import toothbrushIcon from "../assets/icons/white/banho-higiene-bucal.svg"
import perfumeIcon from "../assets/icons/white/banho-perfumes.svg"

// ========================================
// SUBCATEGORIAS — VESTUÁRIO
// ========================================

import vestuarioBiquinisIcon from "../assets/icons/white/vestuario-biquinis-maios-sungas.svg"
import vestuarioCalcasIcon from "../assets/icons/white/vestuario-calcas.svg"
import vestuarioCamisetasIcon from "../assets/icons/white/vestuario-camisetas-coletes.svg"
import vestuarioCintosIcon from "../assets/icons/white/vestuario-cintos-lencos-cachecol.svg"
import vestuarioJaquetasIcon from "../assets/icons/white/vestuario-jaquetas-blusas.svg"
import vestuarioLentesContatoIcon from "../assets/icons/white/vestuario-lentes-contato.svg"
import vestuarioMascarasIcon from "../assets/icons/white/vestuario-mascaras-avental-perucas.svg"
import vestuarioMeiasIcon from "../assets/icons/white/vestuario-meias.svg"
import vestuarioShortsIcon from "../assets/icons/white/vestuario-shorts-bermudas.svg"
import vestuarioTopsIcon from "../assets/icons/white/vestuario-tops-saias-vestidos.svg"
import vestuarioToucasIcon from "../assets/icons/white/vestuario-toucas-luvas.svg"

// ========================================
// SUBCATEGORIAS — BEBÊS E INFANTIL
// ========================================

import bebesAgasalhosIcon from "../assets/icons/white/bebes-agasalhos.svg"
import bebesBabadorIcon from "../assets/icons/white/bebes-babador.svg"
import bebesBoneIcon from "../assets/icons/white/bebes-bone.svg"
import bebesCalcadosIcon from "../assets/icons/white/bebes-calcados.svg"
import bebesCalcasIcon from "../assets/icons/white/bebes-calcas.svg"
import bebesFantasiaIcon from "../assets/icons/white/bebes-fantasia.svg"
import bebesMamadeiraIcon from "../assets/icons/white/bebes-mamadeira-chupeta.svg"
import bebesNaninhasIcon from "../assets/icons/white/bebes-naninhas.svg"
import bebesPomadasIcon from "../assets/icons/white/bebes-pomadas-talcos-lencos.svg"
import bebesRoupasIntimasIcon from "../assets/icons/white/bebes-roupas-intimas-meias-biquinis.svg"
import bebesShortsIcon from "../assets/icons/white/bebes-shorts-saias.svg"
import bebesTrocadorIcon from "../assets/icons/white/bebes-trocador-fraldas.svg"
import bebesVestidosIcon from "../assets/icons/white/bebes-vestidos-camisetas.svg"

// ========================================
// CATEGORIAS
// ========================================

export const categories = [
    {
        id: "academia",
        nome: "Acessórios de Academia, Luvas, Joelheiras e Faixas",
        icone: academiaIcon,
        subcategorias: [],
    },

    {
        id: "banhos-cuidados",
        nome: "Banhos e Cuidados Pessoais",
        icone: banhoIcon,
        subcategorias: [
            {
                id: "esponja",
                nome: "Esponjas e Sabonetes",
                icone: soapIcon,
            },
            {
                id: "pente",
                nome: "Pentes e Escovas",
                icone: combIcon,
            },
            {
                id: "shampoo",
                nome: "Shampoo, Condicionador, Cremes e Desodorantes",
                icone: shampooIcon,
            },
            {
                id: "toalha",
                nome: "Toalhas, Mantas e Roupão",
                icone: towelIcon,
            },
            {
                id: "itens-barbear",
                nome: "Itens de Barbear",
                icone: razorIcon,
            },
            {
                id: "boia",
                nome: "Boias",
                icone: buoyIcon,
            },
            {
                id: "maquiagem",
                nome: "Maquiagens e Pinças",
                icone: makeupIcon,
            },
            {
                id: "higiene-bucal",
                nome: "Higiene Bucal",
                icone: toothbrushIcon,
            },
            {
                id: "perfume",
                nome: "Perfumes",
                icone: perfumeIcon,
            },
        ],
    },

    {
        id: "bone",
        nome: "Bonés, Viseiras e Capacetes",
        icone: bonesIcon,
        subcategorias: [],
    },

    {
        id: "brinquedos",
        nome: "Brinquedos",
        icone: brinquedosIcon,
        subcategorias: [],
    },

    {
        id: "calcados-chinelos",
        nome: "Calçados e Chinelos",
        icone: calcadosIcon,
        subcategorias: [],
    },

    {
        id: "eletronicos-equipamentos",
        nome: "Eletrônicos e Equipamentos",
        icone: eletronicosIcon,
        subcategorias: [],
    },

    {
        id: "futebol",
        nome: "Futebol, Bolas, Luvas e Caneleiras",
        icone: futebolIcon,
        subcategorias: [],
    },

    {
        id: "mochilas-bolsas",
        nome: "Mochilas, Bolsas, Sacolas e Necessaires",
        icone: mochilasIcon,
        subcategorias: [],
    },

    {
        id: "oculos",
        nome: "Óculos de Sol, Leitura e Natação",
        icone: oculosIcon,
        subcategorias: [],
    },

    {
        id: "tenis-raquetes",
        nome: "Tênis, Raquetes e Munhequeiras",
        icone: tenisIcon,
        subcategorias: [],
    },

    {
        id: "remedios",
        nome: "Remédios",
        icone: remediosIcon,
        subcategorias: [],
    },

    {
        id: "squeezes",
        nome: "Squeezes, Garrafinhas e Copos",
        icone: squeezesIcon,
        subcategorias: [],
    },

    {
        id: "vestuario",
        nome: "Vestuário",
        icone: vestuarioIcon,
        subcategorias: [
            {
                id: "biquinis-maio-sungas-cangas",
                nome: "Biquínis, Maiôs, Sungas e Cangas",
                icone: vestuarioBiquinisIcon,
            },
            {
                id: "camisetas-coletes",
                nome: "Camisetas e Coletes",
                icone: vestuarioCamisetasIcon,
            },
            {
                id: "jaquetas-blusas-casaquinhos",
                nome: "Jaquetas, Blusas e Casaquinhos",
                icone: vestuarioJaquetasIcon,
            },
            {
                id: "meias",
                nome: "Meias",
                icone: vestuarioMeiasIcon,
            },
            {
                id: "shorts-bermudas",
                nome: "Shorts e Bermudas",
                icone: vestuarioShortsIcon,
            },
            {
                id: "calcas",
                nome: "Calças",
                icone: vestuarioCalcasIcon,
            },
            {
                id: "tops-saias-vestidos",
                nome: "Tops, Saias e Vestidos",
                icone: vestuarioTopsIcon,
            },
            {
                id: "cintos-lenco-cachecol",
                nome: "Cintos, Lenços e Cachecol",
                icone: vestuarioCintosIcon,
            },
            {
                id: "toucas-luvas",
                nome: "Toucas e Luvas",
                icone: vestuarioToucasIcon,
            },
            {
                id: "lentes-contato",
                nome: "Lentes de Contato",
                icone: vestuarioLentesContatoIcon,
            },
            {
                id: "mascaras-avental-perucas",
                nome: "Máscaras, Aventais e Perucas",
                icone: vestuarioMascarasIcon,
            },
        ],
    },

    {
        id: "vestuario-bebe",
        nome: "Vestuário Bebê e Infantil",
        icone: infantilIcon,
        subcategorias: [
            {
                id: "agasalhos",
                nome: "Agasalhos",
                icone: bebesAgasalhosIcon,
            },
            {
                id: "shorts-saias",
                nome: "Shorts e Saias",
                icone: bebesShortsIcon,
            },
            {
                id: "vestidos-camisetas-camisas",
                nome: "Vestidos, Camisetas e Camisas",
                icone: bebesVestidosIcon,
            },
            {
                id: "calcas",
                nome: "Calças",
                icone: bebesCalcasIcon,
            },
            {
                id: "roupas-intimas-meias-biquinis",
                nome: "Roupas Íntimas, Meias e Biquínis",
                icone: bebesRoupasIntimasIcon,
            },
            {
                id: "pomadas-talcos-lencos",
                nome: "Pomadas, Talcos e Lenços",
                icone: bebesPomadasIcon,
            },
            {
                id: "mamadeira-chupeta",
                nome: "Mamadeira e Chupeta",
                icone: bebesMamadeiraIcon,
            },
            {
                id: "fantasia",
                nome: "Fantasia",
                icone: bebesFantasiaIcon,
            },
            {
                id: "calcados",
                nome: "Calçados",
                icone: bebesCalcadosIcon,
            },
            {
                id: "bone-chapeu-toucas-luvas",
                nome: "Boné, Chapéu, Toucas e Luvas",
                icone: bebesBoneIcon,
            },
            {
                id: "naninhas",
                nome: "Naninhas",
                icone: bebesNaninhasIcon,
            },
            {
                id: "trocador-fraldas",
                nome: "Trocador de Fraldas",
                icone: bebesTrocadorIcon,
            },
            {
                id: "babador",
                nome: "Babador",
                icone: bebesBabadorIcon,
            },
        ],
    },

    {
        id: "material-escolar",
        nome: "Material Escolar e Livros",
        icone: livrosIcon,
        subcategorias: [],
    },

    {
        id: "alimenticios",
        nome: "Alimentícios, Vaper e Potes",
        icone: alimenticiosIcon,
        subcategorias: [],
    },

    {
        id: "carteiras-documentos",
        nome: "Carteiras, Documentos e Dinheiro",
        icone: carteirasIcon,
        subcategorias: [],
    },

    {
        id: "guarda-chuvas",
        nome: "Guarda-Chuvas, Chaves e Fitas",
        icone: chavesIcon,
        subcategorias: [],
    },

    {
        id: "pulseiras-colares",
        nome: "Pulseiras, Colares, Brincos e Presilhas",
        icone: pulseirasIcon,
        subcategorias: [],
    },

    {
        id: "skates",
        nome: "Skates",
        icone: skateIcon,
        subcategorias: [],
    },

    {
        id: "cobertores-cachecol",
        nome: "Cobertores, Cachecol, Tapetes e Almofadas",
        icone: cobertoresIcon,
        subcategorias: [],
    },

    {
        id: "sem-categoria",
        nome: "Itens sem Categoria",
        icone: semCategoriaIcon,
        subcategorias: [],
    },
]