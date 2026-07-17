import AdminLayout from "../../layouts/AdminLayout"

function ActiveItems() {
    return (
        <AdminLayout>
            <section className="admin-page">
                <h2>Itens Ativos</h2>
                <p>Visualize os objetos que ainda aguardam retirada.</p>
            </section>
        </AdminLayout>
    )
}

export default ActiveItems