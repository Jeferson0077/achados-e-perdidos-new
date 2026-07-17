import AdminHeader from "../components/admin/AdminHeader"
import AdminSidebar from "../components/admin/AdminSidebar"

function AdminLayout({ children }) {
    return (
        <main className="admin-layout">
            <AdminSidebar />

            <section className="admin-content">
                <AdminHeader />

                {children}
            </section>
        </main>
    )
}

export default AdminLayout