import { DataTable } from '@/components/ui/table/data-table';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useProvincesTableFilters } from './use-provinces-table-filters';
import { CellAction } from './cell-action';
import { ColumnDef } from '@tanstack/react-table';
import { User } from '@/constants/mock-api-users';
import { Badge } from '@/components/ui/badge';

export default function UsersTable({
  data,
  totalData,
  onDelete,
  onUpdate
}: {
  data: User[];
  totalData: number;
  onDelete: (id: number) => void;
  onUpdate: (id: number) => void;
}) {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useProvincesTableFilters();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'id',
      header: 'ID'
    },
    {
      accessorKey: 'name',
      header: 'Nama'
    },
    {
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'phone_number',
      header: 'Nomor Telepon'
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Badge className="capitalize">{row.original.role}</Badge>
      )
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <CellAction
          data={row.original}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="Data Pengguna"
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
