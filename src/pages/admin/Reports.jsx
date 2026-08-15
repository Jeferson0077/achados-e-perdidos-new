import { useState } from "react"

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts"

import { useItems } from "../../contexts/ItemsContext"
import { ITEM_STATUS } from "../../constants/itemStatus"
import AdminLayout from "../../layouts/AdminLayout"

function Reports() {
    const { items } = useItems()

    const [dataInicial, setDataInicial] =
        useState("")

    const [dataFinal, setDataFinal] =
        useState("")

    function itemEstaNoPeriodo(item) {
        const dataItem =
            item.dataEncontrado ||
            item.data

        if (!dataItem) {
            return false
        }

        const data =
            new Date(dataItem)

        if (
            dataInicial &&
            data < new Date(dataInicial)
        ) {
            return false
        }

        if (
            dataFinal &&
            data >
            new Date(
                `${dataFinal}T23:59:59`
            )
        ) {
            return false
        }

        return true
    }

    const itensFiltrados =
        items.filter(itemEstaNoPeriodo)

    const itensAtivos =
        itensFiltrados.filter(
            (item) =>
                item.status ===
                ITEM_STATUS.ATIVO
        )

    const itensRetirados =
        itensFiltrados.filter(
            (item) =>
                item.status ===
                ITEM_STATUS.RETIRADO
        )

    const itensDoados =
        itensFiltrados.filter(
            (item) =>
                item.status ===
                ITEM_STATUS.DOADO
        )

    const totalItens =
        itensFiltrados.length

    const taxaDevolucao =
        totalItens > 0
            ? (
                (itensRetirados.length / totalItens) *
                100
            ).toFixed(1)
            : "0.0"

    const categorias =
        itensFiltrados.reduce((acumulador, item) => {
            const categoria =
                item.categoria || "Sem categoria"

            acumulador[categoria] =
                (acumulador[categoria] || 0) + 1

            return acumulador
        }, {})

    const categoriasOrdenadas = Object.entries(categorias)
        .sort((categoriaA, categoriaB) =>
            categoriaB[1] - categoriaA[1]
        )
    const pieData = categoriasOrdenadas.map(
        ([categoria, quantidade]) => ({
            name: categoria,
            value: quantidade,
        })
    )

    const COLORS = [
        "#3b82f6",
        "#22c55e",
        "#f59e0b",
        "#a855f7",
        "#ef4444",
        "#06b6d4",
        "#84cc16",
    ]

    function calcularTempoMedioRetirada() {
        const tempos = itensRetirados
            .map((item) => {
                const dataEncontrado =
                    item.dataEncontrado || item.data

                const dataRetirada =
                    item.dataRetirada

                if (!dataEncontrado || !dataRetirada) {
                    return null
                }

                const inicio = new Date(dataEncontrado)
                const fim = new Date(dataRetirada)

                const diferenca =
                    fim.getTime() - inicio.getTime()

                return Math.floor(
                    diferenca /
                    (1000 * 60 * 60 * 24)
                )
            })
            .filter(
                (dias) =>
                    Number.isFinite(dias) &&
                    dias >= 0
            )

        if (tempos.length === 0) {
            return 0
        }

        const totalDias = tempos.reduce(
            (soma, dias) => soma + dias,
            0
        )

        return Math.round(
            totalDias / tempos.length
        )
    }

    const tempoMedioRetirada =
        calcularTempoMedioRetirada()

    return (
        <AdminLayout>
            <section className="admin-page">
                <div className="admin-page__header">
                    <div>
                        <h2>Relatórios</h2>

                        <p>
                            Acompanhe os principais indicadores
                            do sistema.
                        </p>
                    </div>

                    <div className="reports-filters">
                        <label className="reports-filter">
                            <span>Data inicial</span>

                            <input
                                type="date"
                                value={dataInicial}
                                onChange={(event) =>
                                    setDataInicial(
                                        event.target.value
                                    )
                                }
                            />
                        </label>

                        <label className="reports-filter">
                            <span>Data Final</span>

                            <input
                                type="date"
                                value={dataFinal}
                                onChange={(event) =>
                                    setDataFinal(
                                        event.target.value
                                    )
                                }
                            />
                        </label>
                    </div>

                </div>

                <div className="reports-summary">
                    <article className="report-card">
                        <span>Total cadastrado</span>
                        <strong>{totalItens}</strong>
                    </article>

                    <article className="report-card">
                        <span>Itens ativos</span>
                        <strong>{itensAtivos.length}</strong>
                    </article>

                    <article className="report-card">
                        <span>Itens retirados</span>
                        <strong>{itensRetirados.length}</strong>
                    </article>

                    <article className="report-card">
                        <span>Itens doados</span>
                        <strong>{itensDoados.length}</strong>
                    </article>
                </div>

                <div className="reports-secondary">
                    <article className="report-highlight">
                        <span>Taxa de devolução</span>

                        <strong>
                            {taxaDevolucao}%
                        </strong>

                        <p>
                            Percentual de itens retirados em
                            relação ao total cadastrado.
                        </p>
                    </article>

                    <article className="report-highlight">
                        <span>
                            Tempo médio até retirada
                        </span>

                        <strong>
                            {tempoMedioRetirada}{" "}
                            {tempoMedioRetirada === 1
                                ? "dia"
                                : "dias"}
                        </strong>

                        <p>
                            Média entre o cadastro e a
                            devolução dos objetos.
                        </p>
                    </article>
                </div>

                <section className="reports-panel">
                    <div className="reports-panel__header">
                        <div>
                            <span>Visualização</span>

                            <h3>Itens por categoria</h3>
                        </div>
                    </div>

                    <div className="reports-chart">
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={115}
                                    paddingAngle={3}
                                    dataKey="value"
                                    nameKey="name"
                                    stroke="#151515"
                                    strokeWidth={3}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={entry.name}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>

                                <text
                                    x="50%"
                                    y="47%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="#ffffff"
                                    fontSize="30"
                                    fontWeight="700"
                                >
                                    {totalItens}
                                </text>

                                <text
                                    x="50%"
                                    y="56%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="#7a7a7a"
                                    fontSize="12"
                                >
                                    itens cadastrados
                                </text>

                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                <section className="reports-panel">
                    <div className="reports-panel__header">
                        <div>
                            <span>Distribuição</span>
                            <h3>Itens por categoria</h3>
                        </div>
                    </div>

                    {categoriasOrdenadas.length === 0 ? (
                        <div className="reports-panel__empty">
                            Nenhum dado disponível.
                        </div>
                    ) : (
                        <div className="reports-category-list">
                            {categoriasOrdenadas.map(
                                ([categoria, quantidade]) => (
                                    <div
                                        className="reports-category-item"
                                        key={categoria}
                                    >
                                        <span>{categoria}</span>

                                        <strong>
                                            {quantidade}
                                        </strong>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </section>
            </section>
        </AdminLayout>
    )
}

export default Reports