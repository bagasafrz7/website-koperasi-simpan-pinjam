'use client';
import { useSession } from 'next-auth/react';
import OverViewPage from './overview';
import OverviewUser from './overview-user';

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <>{session?.user?.name === 'admin' ? <OverViewPage /> : <OverviewUser />}</>
  );
}
