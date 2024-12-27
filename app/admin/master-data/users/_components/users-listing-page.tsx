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
import UsersTable from './users-tables';
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
import { User, fakeUsers } from '@/constants/mock-api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, {
    message: 'Nama tidak boleh kosong'
  }),
  email: z.string().email({
    message: 'Format email tidak valid'
  }),
  phone_number: z.string().regex(/^08\d{8,11}$/, {
    message: 'Format nomor telepon tidak valid (contoh: 081234567890)'
  }),
  role: z.enum(['admin', 'user'], {
    required_error: 'Role harus dipilih'
  })
});

export default function UsersListingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [totalUser, setTotalUser] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<null | number>(null);

  const page = searchParams.get('page');
  const search = searchParams.get('q');
  const pageLimit = searchParams.get('limit');

  const fetchData = async () => {
    try {
      const data = await fakeUsers.getAll({
        page: page ? parseInt(page, 10) : undefined,
        limit: pageLimit ? parseInt(pageLimit, 10) : undefined,
        ...(search && { search })
      });
      setUsers(data.users || []);
      setTotalUser(data.total_users || 0);
    } catch (error) {
      toast.error('Gagal mengambil data');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fakeUsers.deleteUser(id);
      if (response.success) {
        toast.success(`Data pengguna dengan ID ${id} berhasil dihapus`);
        await fetchData();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Gagal menghapus');
    }
  };

  const handleUpdate = async (id: number) => {
    setIsDialogOpen(true);
    setUserId(id);
  };

  useEffect(() => {
    fetchData();
  }, [page, pageLimit, search]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: userId || undefined,
      name: '',
      email: '',
      phone_number: '',
      role: 'user'
    }
  });

  useEffect(() => {
    if (userId) {
      // Ambil data berdasarkan ID
      fakeUsers.getUserById(userId).then((response) => {
        if (response.success) {
          form.reset({
            id: response.user?.id,
            name: response.user?.name,
            email: response.user?.email,
            phone_number: response.user?.phone_number,
            role: response.user?.role
          });
        } else {
          toast.error('User tidak ditemukan');
        }
      });
    } else {
      form.reset({
        id: undefined,
        name: '',
        email: '',
        phone_number: '',
        role: 'user'
      });
    }
  }, [userId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const response = values.id
      ? await fakeUsers.updateUser(values.id, {
          name: values.name,
          email: values.email,
          phone_number: values.phone_number,
          role: values.role
        })
      : await fakeUsers.createUser({
          name: values.name,
          email: values.email,
          phone_number: values.phone_number,
          role: values.role
        });

    if (response.success) {
      toast.success(
        `${
          values.id ? 'Berhasil memperbarui' : 'Berhasil menambahkan'
        } data pengguna: ${values.name}`
      );
      setIsDialogOpen(false);
      setLoading(false);
      fetchData();
    } else {
      setLoading(false);
      toast.error(response.message || 'Terjadi kesalahan, silakan coba lagi');
    }
  }

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Data Pengguna (${totalUser})`}
            description="Kelola data pengguna"
          />

          <p
            // href="/admin/master-data/wilayah/new"
            onClick={() => {
              setUserId(null);
              setIsDialogOpen(true);
              form.reset();
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
        <UsersTable
          data={users}
          totalData={totalUser}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{userId ? 'Ubah Data' : 'Tambah Data'}</DialogTitle>
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
                        <FormLabel>Nama</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukan nama..." {...field} />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masukan email..."
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Telepon</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masukan nomor telepon..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
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
