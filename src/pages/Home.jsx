import { useState } from 'react'

import Header from '../components/Header'
import CategoryGrid from '../components/CategoryGrid'
import { categories } from '../data/categories'
import SubcategoryGrid from '../components/SubcategoryGrid'
import ItemGrid from '../components/ItemGrid'
import Footer from '../components/Footer'
import "../styles/header.css";

function Home() {


    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null)

    const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState(null)

    function handleVoltar() {
        if (subcategoriaSelecionada) {
            setSubcategoriaSelecionada(null)
            return
        }

        setCategoriaSelecionada(null)
    }

    return (
        <main className="home">
            <div className="app-container">
                <Header />

                {categoriaSelecionada ? (
                    <section className="content-section">
                        <div className="content-header">
                            <nav className="breadcrumb">
                                <span>Início</span>

                                <span className="breadcrumb__separator">
                                    ›
                                </span>

                                <span>
                                    {categoriaSelecionada.nome}
                                </span>

                                {subcategoriaSelecionada && (
                                    <>
                                        <span className="breadcrumb__separator">
                                            ›
                                        </span>

                                        <span className="breadcrumb__current">
                                            {subcategoriaSelecionada.nome}
                                        </span>
                                    </>
                                )}
                            </nav>

                            <div className="content-header__text">
                                <h2>
                                    {categoriaSelecionada.nome}
                                </h2>

                                {subcategoriaSelecionada ? (
                                    <>
                                        <p className="content-header__label">
                                            Subcategoria
                                        </p>

                                        <p className="content-header__subcategory">
                                            {subcategoriaSelecionada.nome}
                                        </p>
                                    </>
                                ) : categoriaSelecionada.subcategorias.length > 0 ? (
                                    <p>
                                        Escolha uma subcategoria para continuar.
                                    </p>
                                ) : (
                                    <p>
                                        Visualize abaixo os itens encontrados.
                                    </p>
                                )}
                            </div>

                            <button
                                type="button"
                                className="back-button"
                                onClick={handleVoltar}
                            >
                                ← Voltar
                            </button>
                        </div>

                        {subcategoriaSelecionada ? (
                            <ItemGrid
                                categoria={categoriaSelecionada}
                                subcategoria={subcategoriaSelecionada}
                            />
                        ) : categoriaSelecionada.subcategorias.length > 0 ? (
                            <SubcategoryGrid
                                categoriaId={categoriaSelecionada.id}
                                subcategorias={categoriaSelecionada.subcategorias}
                                onSelectSubcategory={setSubcategoriaSelecionada}
                            />
                        ) : (
                            <ItemGrid
                                categoria={categoriaSelecionada}
                            />
                        )}
                    </section>
                ) : (
                    <CategoryGrid
                        categories={categories}
                        onSelectCategory={(category) => {
                            setCategoriaSelecionada(category)
                            setSubcategoriaSelecionada(null)
                        }}
                    />
                )}

                <Footer />
            </div>
        </main>
    )
}

export default Home