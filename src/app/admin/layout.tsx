import DashboardLayout from '@/components/admin-dashboard/DashboardLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    );
}
