'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export const OPTION_TRANSACTION = [
  { value: 'Simpan', label: 'Simpan' },
  { value: 'Pinjam', label: 'Pinjam' }
];

export function useProvincesTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [genderFilter, setGenderFilter] = useQueryState(
    'gender',
    searchParams.gender.withOptions({ shallow: false }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const [typeFilter, setTypeFilter] = useQueryState(
    'type',
    searchParams.type.withOptions({ shallow: false }).withDefault('')
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setGenderFilter(null);
    setTypeFilter(null);

    setPage(1);
  }, [setSearchQuery, setGenderFilter, setPage, setTypeFilter]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!genderFilter || !typeFilter;
  }, [searchQuery, genderFilter, typeFilter]);

  return {
    searchQuery,
    setSearchQuery,
    genderFilter,
    setGenderFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    typeFilter,
    setTypeFilter
  };
}
