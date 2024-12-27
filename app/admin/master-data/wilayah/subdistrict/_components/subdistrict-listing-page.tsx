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
import { fakeCities } from '@/constants/mock-api-city';
import { fakeSubdistricts } from '@/constants/mock-api-subdistrict';
import SubdistrictTable from './subsdistrict-tables';

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, {
    message: 'Nama Kota tidak boleh kosong'
  })
});

export default function SubdistrictListingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const params = useParams();
  const citiesId =
    typeof params?.citiesId === 'string'
      ? parseInt(params.citiesId, 10)
      : undefined;

  const [provinces, setProvinces] = useState<any>([]);
  const [totalSubdistrict, setTotalSubdistrict] = useState<any>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cityName, setCityName] = useState<string>('');
  const [subdistrictId, setSubdistrictId] = useState<number>(0);

  const page = searchParams.get('page');
  const search = searchParams.get('q');
  const pageLimit = searchParams.get('limit');

  const fetchData = async (id: number) => {
    try {
      const data = await fakeSubdistricts.getAll({
        page: page ? parseInt(page, 10) : undefined,
        limit: pageLimit ? parseInt(pageLimit, 10) : undefined,
        ...(search && { search }),
        cityId: id
      });

      setProvinces(data.subdistricts);
      setTotalSubdistrict(data?.total_subdistricts);
    } catch (error) {
      toast.error('Gagal mengambil data cities');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fakeSubdistricts.deleteSubdistrict(id);
      if (response.success) {
        toast.success(`Kecamatan dengan ID ${id} berhasil dihapus`);
        if (citiesId) {
          await fetchData(citiesId);
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Gagal menghapus kecamatan');
    }
  };

  const handleUpdate = async (id: number) => {
    setIsDialogOpen(true);
    setSubdistrictId(id);
  };

  useEffect(() => {
    if (citiesId) {
      fetchData(citiesId);
    }
  }, [page, pageLimit, search, citiesId, subdistrictId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: citiesId,
      name: ''
    }
  });

  useEffect(() => {
    if (subdistrictId) {
      console.log(subdistrictId);
      fakeSubdistricts
        .getSubdistrictById(subdistrictId)
        .then((response: any) => {
          if (response.success) {
            form.reset({
              id: response.subdistrict.id,
              name: response.subdistrict.name
            });
          } else {
            toast.error('Kota tidak ditemukan');
          }
        });
    }
    if (citiesId) {
      fakeCities.getCityById(citiesId).then((response: any) => {
        if (response.success) {
          setCityName(response.city.name);
        } else {
          toast.error('Kota tidak ditemukan');
        }
      });
    }
  }, [subdistrictId, form, citiesId]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const response = subdistrictId
      ? await fakeSubdistricts.updateSubdistrict(subdistrictId, {
          name: values.name
        })
      : await fakeSubdistricts.createSubdistrict({
          name: values.name,
          cityId: citiesId
        });
    if (response.success) {
      toast.success(
        `${
          values.id ? 'Berhasil memperbarui Data' : 'Berhasil menambahkan data'
        }: ${values.name}`
      );
      setIsDialogOpen(false);
      setLoading(false);
      if (citiesId) {
        fetchData(citiesId);
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
            title={`Data Wilayah Kecamatan (${totalSubdistrict})`}
            description={`Kelola Data Kecamatan dari Kabupaten/Kota  ${cityName}`}
          />

          <p
            // href="/admin/master-data/wilayah/new"
            onClick={() => {
              setSubdistrictId(0);
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
        <SubdistrictTable
          data={provinces}
          totalData={totalSubdistrict}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {subdistrictId ? 'Ubah Data' : 'Tambah Data'}
            </DialogTitle>
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
                        <FormLabel>Nama Kecamatan</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masukan Nama Kecamatan..."
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
