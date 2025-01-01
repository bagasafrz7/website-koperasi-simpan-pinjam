'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import PageContainer from '@/components/layout/page-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Province, fakeProvinces } from '@/constants/mock-api-provinces';
import ProvincesTable from './provinces-tables';
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

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, {
    message: 'Nama Provinsi tidak boleh kosong'
  })
});

export default function ProvincesListingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [totalProvinces, setTotalProvinces] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [provinceId, setProvinceId] = useState<null | number>(null);

  const page = searchParams.get('page');
  const search = searchParams.get('q');
  const pageLimit = searchParams.get('limit');

  const fetchData = async () => {
    try {
      const data = await fakeProvinces.getAll({
        page: page ? parseInt(page, 10) : undefined,
        limit: pageLimit ? parseInt(pageLimit, 10) : undefined,
        ...(search && { search })
      });

      setProvinces(data.provinces);
      setTotalProvinces(data.total_provinces);
    } catch (error) {
      toast.error('Gagal mengambil data provinsi');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fakeProvinces.deleteProvince(id);
      if (response.success) {
        toast.success(`Provinsi dengan ID ${id} berhasil dihapus`);
        await fetchData();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Gagal menghapus provinsi');
    }
  };

  const handleUpdate = async (id: number) => {
    setIsDialogOpen(true);
    setProvinceId(id);
  };

  const handleDetail = async (id: number) => {
    router.push(`/admin/master-data/wilayah/city/${id}`);
  };

  useEffect(() => {
    fetchData();
  }, [page, pageLimit, search]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: provinceId || undefined,
      name: ''
    }
  });

  useEffect(() => {
    if (provinceId !== null) {
      fakeProvinces.getProvinceById(provinceId).then((response: any) => {
        if (response.success) {
          form.reset({
            id: response.province.id,
            name: response.province.name
          });
        } else {
          toast.error('Provinsi tidak ditemukan');
        }
      });
    } else {
      form.reset({
        id: undefined,
        name: ''
      });
    }
  }, [provinceId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const response = values.id
      ? await fakeProvinces.updateProvince(values.id, {
          name: values.name
        })
      : await fakeProvinces.createProvince({
          name: values.name
        });
    if (response.success) {
      toast.success(
        `${
          values.id ? 'Berhasil memperbarui Data' : 'Berhasil menambahkan data'
        }: ${values.name}`
      );
      setIsDialogOpen(false);
      setLoading(false);
      fetchData();
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
            title={`Data Wilayah Provinsi (${totalProvinces})`}
            description="Kelola data wilayah Provinsi"
          />

          <p
            // href="/admin/master-data/wilayah/new"
            onClick={() => {
              setProvinceId(null);
              form.reset();
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
          totalData={totalProvinces}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onDetail={handleDetail}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {provinceId ? 'Ubah Data' : 'Tambah Data'}
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
                        <FormLabel>Nama Provinsi</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masukan Nama Provinsi..."
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
