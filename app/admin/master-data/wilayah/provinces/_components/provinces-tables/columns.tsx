// 'use client';
// import { Checkbox } from '@/components/ui/checkbox';
// import { ColumnDef } from '@tanstack/react-table';
// import { CellAction } from './cell-action';
// import { Province } from '@/constants/mock-api-provinces';

// export const columns: ColumnDef<Province>[] = [
//   {
//     id: 'select',
//     header: ({ table }) => (
//       <Checkbox
//         checked={table.getIsAllPageRowsSelected()}
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false
//   },
//   {
//     accessorKey: 'id',
//     header: 'ID'
//   },
//   {
//     accessorKey: 'name',
//     header: 'Nama Provinsi'
//   },
//   {
//     id: 'actions',
//     cell: ({ row }) => <CellAction data={row.original} />
//   }
// ];
