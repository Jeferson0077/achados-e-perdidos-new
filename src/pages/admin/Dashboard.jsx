import AdminLayout from "../../layouts/AdminLayout"
import DashboardCards from "../../components/admin/DashboardCards"
import RecentItems from "../../components/admin/RecentItems"
import RecentWithdrawals from "../../components/admin/RecentWithdrawals"

function Dashboard() {
    return (
        <AdminLayout>
            <DashboardCards />

            <div className="dashboard-content">
                <RecentItems />
                <RecentWithdrawals />
            </div>
        </AdminLayout>
    )
}

export default Dashboard