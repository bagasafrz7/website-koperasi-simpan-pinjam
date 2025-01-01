'use client';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import {
  OPTION_TRANSACTION,
  useProvincesTableFilters
} from './use-provinces-table-filters';
import { ColumnDef } from '@tanstack/react-table';
import { ApplicationRequest } from '@/constants/mock-api-request-application';
import { Badge } from '@/components/ui/badge';
import { fakeCooperatives } from '@/constants/mock-api-cooperative';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';

export default function Table({
  data,
  totalData
}: {
  data: ApplicationRequest[];
  totalData: number;
}) {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
    typeFilter,
    setTypeFilter
  } = useProvincesTableFilters();

  const getCooperativeName = (id: number) => {
    const cooperative = fakeCooperatives.records.find((coop) => coop.id === id);
    return cooperative ? cooperative.name : 'Tidak Diketahui';
  };

  // Filter data berdasarkan typeFilter
  const filteredData = typeFilter
    ? data.filter((item) => item.type === typeFilter)
    : data;

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'id',
      header: 'ID'
    },
    {
      accessorKey: 'cooperative_id',
      header: 'Koperasi ID',
      cell: ({ row }) => (
        <span>{getCooperativeName(row.original.cooperative_id)}</span>
      )
    },
    {
      accessorKey: 'amount',
      header: 'Jumlah',
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
      accessorKey: 'date',
      header: 'Tanggal'
    },
    {
      accessorKey: 'type',
      header: 'Tipe'
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        let badgeColor = 'gray';

        switch (status) {
          case 'Disetujui':
            badgeColor = 'bg-primary';
            break;
          case 'Diajukan':
            badgeColor = 'bg-yellow-500';
            break;
          default:
            badgeColor = 'bg-gray-500';
        }

        return <Badge className={`${badgeColor} text-white`}>{status}</Badge>;
      }
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* <DataTableSearch
          searchKey="Data Pengajuan"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        /> */}
        <DataTableFilterBox
          filterKey="type"
          title="Tipe"
          options={OPTION_TRANSACTION}
          setFilterValue={setTypeFilter}
          filterValue={typeFilter}
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <DataTable columns={columns} data={filteredData} totalItems={totalData} />
    </div>
  );
}
