import { DataTable } from '@/components/ui/table/data-table';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useProvincesTableFilters } from './use-provinces-table-filters';
import { ColumnDef } from '@tanstack/react-table';
import { SavingReport } from '@/constants/mock-api-saving-report';
import { Badge } from '@/components/ui/badge';
import { fakeCooperatives } from '@/constants/mock-api-cooperative';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

export default function Table({
  data,
  totalData,
  dateRange,
  setDateRange,
  clearDateRangeFilter
}: {
  data: SavingReport[];
  totalData: number;
  dateRange: DateRange | null;
  setDateRange: (range: DateRange | null) => void;
  clearDateRangeFilter: () => void;
}) {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useProvincesTableFilters();

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range ?? null);
  };

  const getCooperativeName = (id: number) => {
    const cooperative = fakeCooperatives.records.find((coop) => coop.id === id);
    return cooperative ? cooperative.name : 'Tidak Diketahui';
  };

  const filteredData = data.filter((report) => {
    const reportDate = new Date(report.date);
    const isWithinDateRange =
      dateRange?.from && dateRange?.to
        ? reportDate >= dateRange.from && reportDate <= dateRange.to
        : true;
    const matchesSearch =
      report.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase());

    return isWithinDateRange && matchesSearch;
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'id',
      header: 'ID'
    },
    {
      accessorKey: 'full_name',
      header: 'Nama Anggota'
    },
    {
      accessorKey: 'amount',
      header: 'Total Simpanan',
      cell: ({ row }) => (
        <span>
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(row.original.amount)}
        </span>
      )
    },
    {
      accessorKey: 'cooperative_id',
      header: 'Nama Koperasi',
      cell: ({ row }) => (
        <span>{getCooperativeName(row.original.cooperative_id)}</span>
      )
    },
    {
      accessorKey: 'date',
      header: 'Tanggal Simpanan'
    },
    {
      accessorKey: 'type',
      header: 'Tipe Simpanan',
      cell: ({ row }) => <Badge>{row.original.type}</Badge>
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="Data Anggota"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        <CalendarDateRangePicker
          className=""
          dateRange={dateRange ?? undefined}
          onDateRangeChange={handleDateRangeChange}
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
        {dateRange && (
          <Button onClick={clearDateRangeFilter} variant="outline">
            <RefreshCcw className=" size-4" />
            &nbsp; Tanggal
          </Button>
        )}
      </div>
      <DataTable columns={columns} data={filteredData} totalItems={totalData} />
    </div>
  );
}
