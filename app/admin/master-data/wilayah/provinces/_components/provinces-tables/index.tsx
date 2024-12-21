import { DataTable } from '@/components/ui/table/data-table';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useProvincesTableFilters } from './use-provinces-table-filters';
import { Province } from '@/constants/mock-api-provinces';
import { CellAction } from './cell-action';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

export default function ProvincesTable({
  data,
  totalData,
  onDelete,
  onUpdate,
  onDetail
}: {
  data: Province[];
  totalData: number;
  onDelete: (id: number) => void;
  onUpdate: (id: number) => void;
  onDetail: (id: number) => void;
}) {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useProvincesTableFilters();

  const columns: ColumnDef<Province>[] = [
    {
      accessorKey: 'id',
      header: 'ID'
    },
    {
      accessorKey: 'name',
      header: 'Nama Provinsi',
      cell: ({ row }) => (
        <Link
          href={`/admin/master-data/wilayah/city/${row.original.id}`}
          className="underline"
        >
          {row.original.name}
        </Link>
      )
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <CellAction
          data={row.original}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onDetail={onDetail}
        />
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="Data Provinsi"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
