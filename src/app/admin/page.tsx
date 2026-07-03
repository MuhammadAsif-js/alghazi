import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '../../lib/auth';
import { getOrders } from '../actions/order';
import AdminClientDashboard from './AdminClientDashboard';

export const metadata = {
  title: 'Owner Dashboard | AL GHAZI WOOD CRAFTS',
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/admin/login');
  }

  // Fetch orders directly from Prisma DB on server load
  const res = await getOrders();
  const orders = res.success ? res.orders : [];

  return (
    <AdminClientDashboard initialOrders={orders} />
  );
}
