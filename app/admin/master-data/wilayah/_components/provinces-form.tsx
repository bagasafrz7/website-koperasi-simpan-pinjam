'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { fakeProvinces } from '@/constants/mock-api-provinces';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, {
    message: 'Nama Provinsi tidak boleh kosong'
  })
});

export default function ProvincesForm({ provinceId }: { provinceId?: number }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: provinceId,
      name: ''
    }
  });

  useEffect(() => {
    if (provinceId) {
      // Ambil data provinsi berdasarkan ID
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
    }
  }, [provinceId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = values.id
      ? await fakeProvinces.updateProvince(values.id, {
          name: values.name
        })
      : await fakeProvinces.createProvince({
          name: values.name,
          population: 0
        });
    if (response.success) {
      toast.success(
        `${
          values.id ? 'Berhasil memperbarui Data' : 'Berhasil menambahkan data'
        }: ${values.name}`
      );
      router.push('/admin/master-data/wilayah');
    } else {
      toast.error('Terjadi masalah, harap kembali beberapa saat lagi');
    }
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          Employee Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
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
            </div>
            <Button type="submit">Simpan</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
