"use client"


import ChatBox from '@/components/ChatBox';
import withRole from '@/lib/withRole';
import LogoutButton from '@/components/LogoutButton';

function UserPage() {
  return (
    <div>
      <ChatBox />
      <LogoutButton />
    </div>
  );
}

export default withRole(UserPage, ['user']);