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
import { useEffect, useRef, useState } from 'react';
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

type FormValues = z.infer<typeof formSchema>;
interface CooperativeFormProps {
  onSend: any;
  onCancel: any;
  cooperativeId: number | null;
}

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, { message: 'Nama tidak boleh kosong' }),
  province_id: z.string().min(1, { message: 'Provinsi harus dipilih' }),
  city_id: z.string().min(1, { message: 'Kota harus dipilih' }),
  subdistrict_id: z.string().min(1, { message: 'Kecamatan harus dipilih' })
});

export default function CooperativeForm({
  onSend,
  onCancel,
  cooperativeId
}: CooperativeFormProps) {
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [subdistricts, setSubdistricts] = useState<Subdistrict[]>([]);
  const [open, setOpen] = useState(false);
  const [filteredProvinces, setFilteredProvinces] = useState<Province[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [filteredSubdistricts, setFilteredSubdistricts] = useState<
    Subdistrict[]
  >([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      province_id: '',
      city_id: '',
      subdistrict_id: ''
    }
  });

  useEffect(() => {
    const fetchCooperative = async () => {
      if (cooperativeId) {
        const response =
          await fakeCooperatives.getCooperativeById(cooperativeId);
        if (response.success) {
          const cooperative = response.cooperative;
          form.setValue('id', cooperative?.id);
          form.setValue('name', cooperative?.name || '');
          form.setValue(
            'province_id',
            cooperative?.province_id.toString() || ''
          );

          // Fetch cities for the selected province
          const citiesData = await fakeCities.getAll({
            provinceId: cooperative?.province_id,
            limit: 10000
          });
          setCities(citiesData.cities || []);
          setFilteredCities(citiesData.cities || []);
          form.setValue('city_id', cooperative?.city_id.toString() || '');

          // Fetch subdistricts for the selected city
          const subdistrictsData = await fakeSubdistricts.getAll({
            cityId: cooperative?.city_id,
            limit: 10000
          });
          setSubdistricts(subdistrictsData.subdistricts || []);
          setFilteredSubdistricts(subdistrictsData.subdistricts || []);
          form.setValue(
            'subdistrict_id',
            cooperative?.subdistrict_id.toString() || ''
          );
        }
      }
    };

    fetchCooperative();
  }, [cooperativeId, form]);

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
    console.log(cooperativeId);
  }, []);

  const watchProvince = form.watch('province_id');
  const watchCity = form.watch('city_id');

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
      }
    };
    fetchSubdistricts();
  }, [watchCity, form]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setLoading(true);
    try {
      const formattedValues = {
        ...values,
        province_id: Number(values.province_id),
        city_id: Number(values.city_id),
        subdistrict_id: Number(values.subdistrict_id)
      };
      const response = cooperativeId
        ? await fakeCooperatives.updateCooperative(
            cooperativeId,
            formattedValues
          )
        : await fakeCooperatives.createCooperative(formattedValues);

      if (response.success) {
        toast.success(
          `${
            cooperativeId ? 'Berhasil memperbarui' : 'Berhasil menambahkan'
          } data koperasi`
        );
        form.reset();
        onSend();
      }
    } catch (error) {
      toast.error('Terjadi kesalahan, silakan coba lagi');
    }
    setLoading(false);
  };

  return (
    <>
      <div className="rounded-sm border p-4">
        <p className="text-xl font-semibold">
          {!cooperativeId ? 'Tambah Data' : 'Ubah Data'}
        </p>
        <hr className="my-2" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Koperasi</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama koperasi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        {/* <CommandInput
                        placeholder="Cari provinsi..."
                        className="h-9"
                        ref={provinceInputRef}
                        onInput={handleProvinceInputChange}
                      /> */}
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
                                      setCities([]);
                                      setSubdistricts([]);
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
                        {/* <CommandInput
                        placeholder="Cari kota..."
                        className="h-9"
                        ref={cityInputRef}
                        onInput={handleCityInputChange}
                      /> */}
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
                                    setSubdistricts([]);
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
                        {/* <CommandInput
                        placeholder="Cari kecamatan..."
                        className="h-9"
                        onValueChange={handleSubdistrictInputChange}
                      /> */}
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

            <DialogFooter>
              <Button variant="destructive" onClick={onCancel}>
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </div>
    </>
  );
}
