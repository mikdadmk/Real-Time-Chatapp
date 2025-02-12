"use client";

import SubAdminPanel from '@/components/SubAdminPanel';
import withRole from '@/lib/withRole';
import LogoutButton from '@/components/LogoutButton';

function SubAdminPage() {
  return (
    <div>
      <SubAdminPanel />
      <LogoutButton />
    </div>
  );
}

export default withRole(SubAdminPage, [ 'subadmin']);