'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import ProvincesTable from './city-tables';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { City, fakeCities } from '@/constants/mock-api-city';
import { fakeProvinces } from '@/constants/mock-api-provinces';

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, {
    message: 'Nama Kota tidak boleh kosong'
  })
});

export default function CityListingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const params = useParams();
  const provinceId =
    typeof params?.provincesId === 'string'
      ? parseInt(params.provincesId, 10)
      : undefined;

  const [provinces, setProvinces] = useState<any>([]);
  const [totalCities, setTotalCities] = useState<any>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [provinceName, setProvinceName] = useState<string>('');
  const [cityId, setCityId] = useState<number>(0);

  const page = searchParams.get('page');
  const search = searchParams.get('q');
  const pageLimit = searchParams.get('limit');

  const fetchData = async (id: number) => {
    try {
      const data = await fakeCities.getAll({
        page: page ? parseInt(page, 10) : undefined,
        limit: pageLimit ? parseInt(pageLimit, 10) : undefined,
        ...(search && { search }),
        provinceId: id
      });

      setProvinces(data.cities);
      setTotalCities(data?.total_cities);
    } catch (error) {
      toast.error('Gagal mengambil data cities');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fakeCities.deleteCity(id);
      if (response.success) {
        toast.success(`Kota dengan ID ${id} berhasil dihapus`);
        if (provinceId) {
          await fetchData(provinceId);
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Gagal menghapus kota');
    }
  };

  const handleUpdate = async (id: number) => {
    setIsDialogOpen(true);
    setCityId(id);
  };

  const handleDetail = async (id: number) => {
    router.push(`/admin/master-data/wilayah/subdistrict/${id}`);
  };

  useEffect(() => {
    if (provinceId) {
      fetchData(provinceId);
    }
  }, [page, pageLimit, search, provinceId, cityId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: provinceId,
      name: ''
    }
  });

  useEffect(() => {
    if (cityId) {
      // Ambil data provinsi berdasarkan ID
      fakeCities.getCityById(cityId).then((response: any) => {
        if (response.success) {
          form.reset({
            id: response.city.id,
            name: response.city.name
          });
          // setProvinceName(response.province.name);
        } else {
          toast.error('Cities tidak ditemukan');
        }
      });
    }
    if (provinceId) {
      // Ambil data provinsi berdasarkan ID
      fakeProvinces.getProvinceById(provinceId).then((response: any) => {
        if (response.success) {
          setProvinceName(response.province.name);
        } else {
          toast.error('Cities tidak ditemukan');
        }
      });
    }
  }, [cityId, provinceId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const response = cityId
      ? await fakeCities.updateCity(cityId, {
          name: values.name
        })
      : await fakeCities.createCity({
          name: values.name,
          provinceId: provinceId
        });
    if (response.success) {
      toast.success(
        `${
          values.id ? 'Berhasil memperbarui Data' : 'Berhasil menambahkan data'
        }: ${values.name}`
      );
      setIsDialogOpen(false);
      setLoading(false);
      if (provinceId) {
        fetchData(provinceId);
      }
    } else {
      setLoading(false);
      toast.error('Terjadi masalah, harap kembali beberapa saat lagi');
    }
  }

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Data Wilayah Kabupaten/Kota (${totalCities})`}
            description={`Kelola Data Kabupaten/Kota dari Provinsi ${provinceName}`}
          />

          <p
            // href="/admin/master-data/wilayah/new"
            onClick={() => {
              setCityId(0);
              setIsDialogOpen(true);
            }}
            className={cn(
              buttonVariants({ variant: 'default' }),
              'cursor-pointer'
            )}
          >
            <Plus className="mr-2 h-4 w-4" /> Tambah
          </p>
        </div>
        <Separator />
        <ProvincesTable
          data={provinces}
          totalData={totalCities}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onDetail={handleDetail}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{cityId ? 'Ubah Data' : 'Tambah Data'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Kota</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masukan Nama Kota..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Loading...' : 'Simpan'}
                    </Button>
                  </DialogFooter>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
