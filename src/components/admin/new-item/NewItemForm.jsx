import { useState } from "react"
import { ITEM_STATUS } from "../../../constants/itemStatus"

function NewItemForm() {
    const [formData, setFormData] = useState({
        nome: "",
        categoria: "",
        subcategoria: "",
        dataEncontrado: "",
        observacoes: "",
        fotoUrl: "",
    })

    function handleChange(event) {
        const { name, value } = event.target

        setFormData((dadosAtuais) => ({
            ...dadosAtuais,
            [name]: value,
        }))
    }

    function handleSubmit(event) {
        event.preventDefault()

        const novoItem = {
            id: "CAP-000123",
            nome: formData.nome,
            categoria: formData.categoria,
            subcategoria: formData.subcategoria,
            dataEncontrado: formData.dataEncontrado,
            dataCadastro: new Date().toISOString(),
            fotoUrl: formData.fotoUrl,
            observacoes: formData.observacoes,
            status: ITEM_STATUS.ATIVO,
            dataRetirada: null,
            dataDoacao: null,
        }

        console.log("Novo item cadastrado:", novoItem)
    }

    return (
        <form className="new-item-form" onSubmit={handleSubmit}>
            <div className="new-item-form__group">
                <label htmlFor="nome">Nome do item</label>

                <input
                    id="nome"
                    name="nome"
                    type="text"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Ex.: Carteira preta"
                    required
                />
            </div>

            <div className="new-item-form__row">
                <div className="new-item-form__group">
                    <label htmlFor="categoria">Categoria</label>

                    <select
                        id="categoria"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione uma categoria</option>
                        <option value="Acessórios">Acessórios</option>
                        <option value="Vestuário">Vestuário</option>
                        <option value="Eletrônicos">Eletrônicos</option>
                        <option value="Banhos e Cuidados">
                            Banhos e Cuidados
                        </option>
                    </select>
                </div>

                <div className="new-item-form__group">
                    <label htmlFor="subcategoria">Subcategoria</label>

                    <input
                        id="subcategoria"
                        name="subcategoria"
                        type="text"
                        value={formData.subcategoria}
                        onChange={handleChange}
                        placeholder="Ex.: Carteiras"
                    />
                </div>
            </div>

            <div className="new-item-form__row">
                <div className="new-item-form__group">
                    <label htmlFor="dataEncontrado">Data encontrada</label>

                    <input
                        id="dataEncontrado"
                        name="dataEncontrado"
                        type="date"
                        value={formData.dataEncontrado}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="new-item-form__group">
                    <label htmlFor="fotoUrl">Foto</label>

                    <input
                        id="fotoUrl"
                        name="fotoUrl"
                        type="text"
                        value={formData.fotoUrl}
                        onChange={handleChange}
                        placeholder="URL temporária da imagem"
                    />
                </div>
            </div>

            <div className="new-item-form__group">
                <label htmlFor="observacoes">Observações</label>

                <textarea
                    id="observacoes"
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleChange}
                    placeholder="Ex.: Carteira sem documentos"
                    rows="5"
                />
            </div>

            <button className="new-item-form__submit" type="submit">
                Cadastrar item
            </button>
        </form>
    )
}

export default NewItemForm