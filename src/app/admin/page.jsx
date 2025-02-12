"use client"

import AdminPanel from '@/components/AdminPanel';
import withRole from '@/lib/withRole';
import LogoutButton from '@/components/LogoutButton';

function AdminPage() {
  return (
    <div>
      <AdminPanel />
      <LogoutButton />
    </div>
  );
}

export default withRole(AdminPage, ['admin']);