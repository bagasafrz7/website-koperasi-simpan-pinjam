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

export default function CooperativeListingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);
  const [totalCooperative, setTotalCooperative] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [id, setId] = useState<null | number>(null);
  const [refresh, setRefresh] = useState(false);

  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('q') || '';
  const pageLimit = Number(searchParams.get('limit')) || 10;

  const fetchCooperatives = async () => {
    try {
      const data = await fakeCooperatives.getAll({
        page,
        limit: pageLimit,
        search
      });
      console.log(data.cooperatives);
      setCooperatives(data.cooperatives || []);
      setTotalCooperative(data.total_cooperatives || 0);
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
            title={`Data Koperasi (${totalCooperative})`}
            description="Kelola data koperasi"
          />
          <Button
            onClick={() => {
              setIsDialogOpen(true);
              setId(null);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Tambah
          </Button>
        </div>
        <Separator />
        {isDialogOpen && (
          <CooperativeForm
            onSend={() => {
              setRefresh((prev) => !prev);
              fetchCooperatives();
              setIsDialogOpen(false);
            }}
            cooperativeId={id}
            onCancel={() => {
              setIsDialogOpen(false);
            }}
          />
        )}
        <UsersTable
          data={cooperatives}
          totalData={totalCooperative}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          refresh={refresh}
        />
      </div>
    </PageContainer>
  );
}
