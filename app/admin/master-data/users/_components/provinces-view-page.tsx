'use client';
import ProvincesForm from './provinces-form';
import PageContainer from '@/components/layout/page-container';
import { useParams } from 'next/navigation';

export default function ProvincesViewPage() {
  const params = useParams();
  const provinceId =
    typeof params?.provincesId === 'string'
      ? parseInt(params.provincesId, 10)
      : undefined;

  return (
    <PageContainer>
      <ProvincesForm provinceId={provinceId} />
    </PageContainer>
  );
}
