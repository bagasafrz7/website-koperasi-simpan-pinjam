'use client';
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { useProvincesTableFilters } from './use-provinces-table-filters';
import { CellAction } from './cell-action';
import { ColumnDef } from '@tanstack/react-table';
import { Cooperative } from '@/constants/mock-api-cooperative';
import { fakeProvinces } from '@/constants/mock-api-provinces';
import { fakeCities } from '@/constants/mock-api-city';
import { fakeSubdistricts } from '@/constants/mock-api-subdistrict';

export default function Table({
  data,
  totalData,
  onDelete,
  onUpdate,
  refresh
}: {
  data: Cooperative[];
  totalData: number;
  onDelete: (id: number) => void;
  onUpdate: (id: number) => void;
  refresh: any;
}) {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useProvincesTableFilters();

  const [provinceNames, setProvinceNames] = useState<any>({});
  const [cityNames, setCityNames] = useState<any>({});
  const [subdistrictNames, setSubdistrictNames] = useState<any>({});

  useEffect(() => {
    const fetchNames = async () => {
      const provincePromises = data.map(async (item) => {
        const response = await fakeProvinces.getProvinceById(item.province_id);
        if (response.success) {
          return { id: item.province_id, name: response.province?.name };
        }
        return { id: item.province_id, name: 'Tidak ditemukan' };
      });

      const cityPromises = data.map(async (item) => {
        const response = await fakeCities.getCityById(item.city_id);
        if (response.success) {
          return { id: item.city_id, name: response.city?.name };
        }
        return { id: item.city_id, name: 'Tidak ditemukan' };
      });

      const subdistrictPromises = data.map(async (item) => {
        const response = await fakeSubdistricts.getSubdistrictById(
          item.subdistrict_id
        );
        if (response.success) {
          return { id: item.subdistrict_id, name: response.subdistrict?.name };
        }
        return { id: item.subdistrict_id, name: 'Tidak ditemukan' };
      });

      const provinces = await Promise.all(provincePromises);
      const cities = await Promise.all(cityPromises);
      const subdistricts = await Promise.all(subdistrictPromises);

      setProvinceNames(
        Object.fromEntries(provinces.map((p) => [p.id, p.name]))
      );
      setCityNames(Object.fromEntries(cities.map((c) => [c.id, c.name])));
      setSubdistrictNames(
        Object.fromEntries(subdistricts.map((s) => [s.id, s.name]))
      );
    };

    fetchNames();
  }, [data, refresh]);

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
      accessorKey: 'province_id',
      header: 'Provinsi',
      cell: ({ row }) => provinceNames[row.original.province_id] || 'Memuat...'
    },
    {
      accessorKey: 'city_id',
      header: 'Kota/Kabupaten',
      cell: ({ row }) => cityNames[row.original.city_id] || 'Memuat...'
    },
    {
      accessorKey: 'subdistrict_id',
      header: 'Kecamatan',
      cell: ({ row }) =>
        subdistrictNames[row.original.subdistrict_id] || 'Memuat...'
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
          searchKey="Data Koperasi"
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
