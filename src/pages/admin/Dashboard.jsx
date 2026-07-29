import AdminLayout from "../../layouts/AdminLayout"
import DashboardCards from "../../components/admin/DashboardCards"
import RecentItems from "../../components/admin/RecentItems"
import RecentWithdrawals from "../../components/admin/RecentWithdrawals"
import QuickActions from "../../components/admin/QuickActions"
import DashboardAlerts from "../../components/admin/DashboardAlerts"

function Dashboard() {
    return (
        <AdminLayout>
            <DashboardCards />

            <div className="dashboard-content">
                <RecentItems />
                <RecentWithdrawals />
            </div>

            <QuickActions />

            <DashboardAlerts />
        </AdminLayout>
    )
}

export default Dashboard