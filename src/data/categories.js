import academiaIcon from '../assets/icons/white/01-academia.svg'
import banhoIcon from '../assets/icons/white/02-banho-cuidados.svg'
import bonesIcon from '../assets/icons/white/03-bones-viseiras-capacetes.svg'
import soapIcon from '../assets/icons/white/banho-esponjas-sabonetes.svg'
import combIcon from '../assets/icons/white/banho-pentes-escovas.svg'
import shampooIcon from '../assets/icons/white/banho-shampoo-condicionador.svg'
import towelIcon from '../assets/icons/white/banho-toalhas-mantas-roupao.svg'
import razorIcon from '../assets/icons/white/banho-itens-barbear.svg'
import buoyIcon from '../assets/icons/white/banho-boias.svg'
import makeupIcon from '../assets/icons/white/banho-estojos-maquiagem-pincas.svg'
import toothbrushIcon from '../assets/icons/white/banho-higiene-bucal.svg'
import perfumeIcon from '../assets/icons/white/banho-perfumes.svg'

export const categories = [
    {
        id: "academia",
        nome: "Acessórios de Academia, Luvas, Joelheiras e Faixas",
        icone: academiaIcon,
        subcategorias: []
    },

    {
        iid: "banhos-cuidados",
        nome: "Banhos e Cuidados Pessoais",
        icone: banhoIcon,
        subcategorias: [
            {
                id: "esponja",
                nome: "Esponjas e Sabonetes",
                icone: soapIcon
            },
            {
                id: "pente",
                nome: "Pentes e Escovas",
                icone: combIcon
            },
            {
                id: "shampoo",
                nome: "Shampoo, Condicionador, Cremes e Desodorantes",
                icone: shampooIcon
            },
            {
                id: "toalha",
                nome: "Toalhas, Mantas e Roupão",
                icone: towelIcon
            },
            {
                id: "itens-barbear",
                nome: "Itens de Barbear",
                icone: razorIcon
            },
            {
                id: "boia",
                nome: "Boias",
                icone: buoyIcon
            },
            {
                id: "maquiagem",
                nome: "Maquiagens e Pinças",
                icone: makeupIcon
            },
            {
                id: "higiene-bucal",
                nome: "Higiene Bucal",
                icone: toothbrushIcon
            },
            {
                id: "perfume",
                nome: "Perfumes",
                icone: perfumeIcon
            },
        ]
    },

    {
        id: "bone",
        nome: "Bonés, Viseiras e Capacetes",
        icone: bonesIcon,
        subcategorias: []
    },

]