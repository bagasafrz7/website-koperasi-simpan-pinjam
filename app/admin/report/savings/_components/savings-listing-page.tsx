'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import UsersTable from './users-tables';

import {
  Cooperative,
  fakeCooperatives
} from '@/constants/mock-api-cooperative';
import CooperativeForm from './cooperative-form';
import {
  SavingReport,
  fakeSavingReports
} from '@/constants/mock-api-saving-report';
import { DateRange } from 'react-day-picker';

export default function ListingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cooperatives, setCooperatives] = useState<SavingReport[]>([]);
  const [totalCooperative, setTotalCooperative] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [id, setId] = useState<null | number>(null);

  // Tambahkan state untuk dateRange
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('q') || '';
  const pageLimit = Number(searchParams.get('limit')) || 10;

  const fetchCooperatives = async () => {
    try {
      const data = await fakeSavingReports.getAll({
        page,
        limit: pageLimit,
        search,
        startDate: dateRange?.from?.toISOString(),
        endDate: dateRange?.to?.toISOString()
      });
      setCooperatives(data.reports || []);
      setTotalCooperative(data.total_reports || 0);
    } catch (error) {
      toast.error('Gagal mengambil data koperasi');
    }
  };

  useEffect(() => {
    fetchCooperatives();
  }, [page, pageLimit, search, dateRange]);

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
  };

  const clearDateRangeFilter = () => {
    setDateRange(null);
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Data Laporan Simpanan (${totalCooperative})`}
            description="Kelola data laporan simpanan"
          />
        </div>
        <Separator />
        <UsersTable
          data={cooperatives}
          totalData={totalCooperative}
          dateRange={dateRange}
          setDateRange={setDateRange}
          clearDateRangeFilter={clearDateRangeFilter}
        />
      </div>
    </PageContainer>
  );
}
