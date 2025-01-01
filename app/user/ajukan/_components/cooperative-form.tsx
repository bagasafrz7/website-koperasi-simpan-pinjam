'use client';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Province, fakeProvinces } from '@/constants/mock-api-provinces';
import { City, fakeCities } from '@/constants/mock-api-city';
import {
  Subdistrict,
  fakeSubdistricts
} from '@/constants/mock-api-subdistrict';
import { SubmitHandler, useForm } from 'react-hook-form';
import { fakeCooperatives } from '@/constants/mock-api-cooperative';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fakeApplicationRequests } from '@/constants/mock-api-request-application';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type FormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  cooperative_id: z.string().min(1, { message: 'Koperasi harus dipilih' }),
  province_id: z.string().min(1, { message: 'Provinsi harus dipilih' }),
  city_id: z.string().min(1, { message: 'Kota harus dipilih' }),
  subdistrict_id: z.string().min(1, { message: 'Kecamatan harus dipilih' }),
  type: z.enum(['Simpan', 'Pinjam'], { required_error: 'Tipe harus dipilih' }),
  amount: z.number().min(1, { message: 'Jumlah harus lebih dari 0' })
});

export default function CooperativeForm() {
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [subdistricts, setSubdistricts] = useState<Subdistrict[]>([]);
  const [cooperatives, setCooperatives] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [filteredProvinces, setFilteredProvinces] = useState<Province[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [filteredSubdistricts, setFilteredSubdistricts] = useState<
    Subdistrict[]
  >([]);
  const [filteredCooperatives, setFilteredCooperatives] = useState<any[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cooperative_id: '',
      province_id: '',
      city_id: '',
      subdistrict_id: '',
      type: 'Simpan',
      amount: 0
    }
  });

  useEffect(() => {
    const fetchProvinces = async () => {
      const data = await fakeProvinces.getAll({
        page: 1,
        limit: 10000
      });

      const provincesWithKeys = data.provinces.map((province) => ({
        ...province,
        value: province.id,
        label: province.name
      }));

      setProvinces(provincesWithKeys);
      setFilteredProvinces(provincesWithKeys);
    };
    fetchProvinces();
  }, []);

  const watchProvince = form.watch('province_id');
  const watchCity = form.watch('city_id');
  const watchSubdistrict = form.watch('subdistrict_id');

  useEffect(() => {
    const fetchCities = async () => {
      if (watchProvince) {
        const data = await fakeCities.getAll({
          provinceId: parseInt(watchProvince),
          limit: 10000
        });
        setCities(data.cities || []);
        setFilteredCities(data.cities || []);
        form.setValue('city_id', '');
        form.setValue('subdistrict_id', '');
        form.setValue('cooperative_id', '');
      }
    };
    fetchCities();
  }, [watchProvince, form]);

  useEffect(() => {
    const fetchSubdistricts = async () => {
      if (watchCity) {
        const data = await fakeSubdistricts.getAll({
          cityId: parseInt(watchCity),
          limit: 10000
        });
        setSubdistricts(data.subdistricts || []);
        setFilteredSubdistricts(data.subdistricts || []);
        form.setValue('subdistrict_id', '');
        form.setValue('cooperative_id', '');
      }
    };
    fetchSubdistricts();
  }, [watchCity, form]);

  useEffect(() => {
    const fetchCooperatives = async () => {
      if (watchSubdistrict) {
        const data = await fakeCooperatives.getAll({
          subdistrict_id: parseInt(watchSubdistrict),
          limit: 10000
        });
        setCooperatives(data.cooperatives || []);
        setFilteredCooperatives(data.cooperatives || []);
        form.setValue('cooperative_id', '');
      }
    };
    fetchCooperatives();
  }, [watchSubdistrict, form]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setLoading(true);
    try {
      const formattedValues = {
        cooperative_id: Number(values.cooperative_id),
        province_id: Number(values.province_id),
        city_id: Number(values.city_id),
        subdistrict_id: Number(values.subdistrict_id),
        type: values.type,
        date: new Date().toISOString(),
        user_id: 123, // Gantilah dengan ID pengguna yang sesuai
        amount: values.amount
      };

      const response =
        await fakeApplicationRequests.createRequest(formattedValues);

      if (response.success) {
        toast.success('Berhasil mengajukan permintaan');
        form.reset();
      }
    } catch (error) {
      toast.error('Terjadi kesalahan, silakan coba lagi');
    }
    setLoading(false);
  };

  return (
    <>
      <div className="rounded-sm border p-4">
        <p className="text-xl font-semibold">Ajukan Simpan/Pinjam</p>
        <hr className="my-2" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="province_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provinsi</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                          onClick={() => setOpen(!open)}
                        >
                          {field.value
                            ? provinces.find(
                                (province) =>
                                  province.id.toString() === field.value
                              )?.name
                            : 'Pilih Provinsi'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>Provinsi tidak ditemukan.</CommandEmpty>
                          <CommandGroup>
                            <ScrollArea className=" h-96 overflow-auto">
                              {filteredProvinces.map((province) => {
                                return (
                                  <CommandItem
                                    key={province.id}
                                    value={province.id.toString()}
                                    onSelect={() => {
                                      form.setValue(
                                        'province_id',
                                        province.id.toString()
                                      );
                                      form.setValue('city_id', '');
                                      form.setValue('subdistrict_id', '');
                                      form.setValue('cooperative_id', '');
                                      setCities([]);
                                      setSubdistricts([]);
                                      setCooperatives([]);
                                      setOpen(!open);
                                    }}
                                  >
                                    {province.name}
                                    <Check
                                      className={cn(
                                        'ml-auto h-4 w-4',
                                        field.value === province.id.toString()
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                  </CommandItem>
                                );
                              })}
                            </ScrollArea>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kota/Kabupaten</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                          disabled={!watchProvince}
                        >
                          {field.value
                            ? cities.find(
                                (city) => city.id.toString() === field.value
                              )?.name
                            : 'Pilih Kota'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>Kota tidak ditemukan.</CommandEmpty>
                          <CommandGroup>
                            <ScrollArea className="h-48">
                              {filteredCities.map((city) => (
                                <CommandItem
                                  key={city.id}
                                  value={city.id.toString()}
                                  onSelect={() => {
                                    form.setValue(
                                      'city_id',
                                      city.id.toString()
                                    );
                                    form.setValue('subdistrict_id', '');
                                    form.setValue('cooperative_id', '');
                                    setSubdistricts([]);
                                    setCooperatives([]);
                                  }}
                                >
                                  {city.name}
                                  <Check
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      field.value === city.id.toString()
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </ScrollArea>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subdistrict_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kecamatan</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                          disabled={!watchCity}
                        >
                          {field.value
                            ? subdistricts.find(
                                (subdistrict) =>
                                  subdistrict.id.toString() === field.value
                              )?.name
                            : 'Pilih Kecamatan'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>
                            Kecamatan tidak ditemukan.
                          </CommandEmpty>
                          <CommandGroup>
                            <ScrollArea className="h-48">
                              {filteredSubdistricts.map((subdistrict) => (
                                <CommandItem
                                  key={subdistrict.id}
                                  value={subdistrict.id.toString()}
                                  onSelect={() => {
                                    form.setValue(
                                      'subdistrict_id',
                                      subdistrict.id.toString()
                                    );
                                    form.setValue('cooperative_id', '');
                                    setCooperatives([]);
                                  }}
                                >
                                  {subdistrict.name}
                                  <Check
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      field.value === subdistrict.id.toString()
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </ScrollArea>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cooperative_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Koperasi</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                          disabled={!watchSubdistrict}
                        >
                          {field.value
                            ? cooperatives.find(
                                (cooperative) =>
                                  cooperative.id.toString() === field.value
                              )?.name
                            : 'Pilih Koperasi'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>Koperasi tidak ditemukan.</CommandEmpty>
                          <CommandGroup>
                            <ScrollArea className="h-48">
                              {filteredCooperatives.map((cooperative) => (
                                <CommandItem
                                  key={cooperative.id}
                                  value={cooperative.id.toString()}
                                  onSelect={() => {
                                    form.setValue(
                                      'cooperative_id',
                                      cooperative.id.toString()
                                    );
                                  }}
                                >
                                  {cooperative.name}
                                  <Check
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      field.value === cooperative.id.toString()
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </ScrollArea>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Transaksi</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Simpan">Simpan</SelectItem>
                      <SelectItem value="Pinjam">Pinjam</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Masukkan jumlah"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="destructive" onClick={() => form.reset()}>
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Ajukan'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </div>
    </>
  );
}
