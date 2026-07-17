import AdminLayout from "../../layouts/AdminLayout"
import NewItemForm from "../../components/admin/new-item/NewItemForm"

function NewItem() {
    return (
        <AdminLayout>
            <section className="admin-page">
                <div className="admin-page__header">
                    <h2>Novo Item</h2>
                    <p>Cadastre um novo objeto encontrado no clube.</p>
                </div>

                <NewItemForm />
            </section>
        </AdminLayout>
    )
}

export default NewItem