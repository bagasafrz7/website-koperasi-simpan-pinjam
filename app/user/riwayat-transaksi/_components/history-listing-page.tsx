'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import UsersTable from './users-tables';

import {
  Cooperative,
  fakeCooperatives
} from '@/constants/mock-api-cooperative';
import CooperativeForm from './cooperative-form';
import {
  ApplicationRequest,
  fakeApplicationRequests
} from '@/constants/mock-api-request-application';

export default function CooperativeListingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cooperatives, setCooperatives] = useState<ApplicationRequest[]>([]);
  const [totalCooperative, setTotalCooperative] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [id, setId] = useState<null | number>(null);
  const [refresh, setRefresh] = useState(false);

  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('q') || '';
  const pageLimit = Number(searchParams.get('limit')) || 10;

  const fetchCooperatives = async () => {
    try {
      const data = await fakeApplicationRequests.getAll({
        page,
        limit: pageLimit
      });
      setCooperatives(data.requests || []);
      setTotalCooperative(data.total_requests || 0);
    } catch (error) {
      toast.error('Gagal mengambil data koperasi');
    }
  };

  useEffect(() => {
    fetchCooperatives();
  }, [page, pageLimit, search]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fakeCooperatives.deleteCooperative(id);
      if (response.success) {
        toast.success(`Koperasi berhasil dihapus`);
        fetchCooperatives();
      }
    } catch (error) {
      toast.error('Gagal menghapus koperasi');
    }
  };

  const handleUpdate = async (id: number) => {
    setIsDialogOpen(true);
    setId(id);
    console.log(id);
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Data Riwayat Transaksi (${totalCooperative})`}
            description="Kelola data riwayat trasaksi"
          />
        </div>
        <Separator />
        <UsersTable data={cooperatives} totalData={totalCooperative} />
      </div>
    </PageContainer>
  );
}
