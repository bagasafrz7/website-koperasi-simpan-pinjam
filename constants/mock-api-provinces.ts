import { faker } from '@faker-js/faker';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type Province = {
  id: number;
  name: string;
  population: number;
  created_at: string;
  updated_at: string;
};

// Mock province data store
export const fakeProvinces = {
  records: [] as Province[], // Menyimpan daftar objek provinsi

  // Inisialisasi dengan data contoh
  initialize() {
    const sampleProvinces: Province[] = [];
    const provinceNames = [
      'Aceh',
      'Bali',
      'Banten',
      'Bengkulu',
      'DI Yogyakarta',
      'DKI Jakarta',
      'Gorontalo',
      'Jambi',
      'Jawa Barat',
      'Jawa Tengah',
      'Jawa Timur',
      'Kalimantan Barat',
      'Kalimantan Selatan',
      'Kalimantan Tengah',
      'Kalimantan Timur',
      'Kalimantan Utara',
      'Kepulauan Bangka Belitung',
      'Kepulauan Riau',
      'Lampung',
      'Maluku',
      'Maluku Utara',
      'Nusa Tenggara Barat',
      'Nusa Tenggara Timur',
      'Papua',
      'Papua Barat',
      'Riau',
      'Sulawesi Barat',
      'Sulawesi Selatan',
      'Sulawesi Tengah',
      'Sulawesi Tenggara',
      'Sulawesi Utara',
      'Sumatera Barat',
      'Sumatera Selatan',
      'Sumatera Utara'
    ];

    function generateRandomProvinceData(id: number): Province {
      return {
        id,
        name: provinceNames[id - 1],
        population: faker.number.int({ min: 500000, max: 5000000 }),
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        updated_at: faker.date.recent().toISOString()
      };
    }

    // Menghasilkan data provinsi
    for (let i = 1; i <= provinceNames.length; i++) {
      sampleProvinces.push(generateRandomProvinceData(i));
    }

    this.records = sampleProvinces;
  },

  // Mendapatkan semua provinsi dengan pagination dan pencarian
  async getAll({ page = 1, limit = 10, search = '' }: { page?: number; limit?: number; search?: string }) {
    await delay(500); // Simulasi delay
    let provinces = [...this.records];

    // Pencarian berdasarkan nama provinsi
    if (search) {
      provinces = provinces.filter((province) =>
        province.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Urutkan secara menurun berdasarkan ID
    provinces.sort((a, b) => b.id - a.id);

    const totalProvinces = provinces.length;

    // Logika paginasi
    const offset = (page - 1) * limit;
    const paginatedProvinces = provinces.slice(offset, offset + limit);

    return {
      success: true,
      total_provinces: totalProvinces,
      offset,
      limit,
      provinces: paginatedProvinces
    };
  },

  // Mendapatkan provinsi berdasarkan ID
  async getProvinceById(id: number) {
    await delay(500); // Simulasi delay

    // Mencari provinsi berdasarkan ID
    const province = this.records.find((province) => province.id === id);

    if (!province) {
      return {
        success: false,
        message: `Provinsi dengan ID ${id} tidak ditemukan`
      };
    }

    // Mock waktu saat ini
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Provinsi dengan ID ${id} ditemukan`,
      province
    };
  },

  // Menambahkan provinsi baru
  async createProvince(newProvince: Omit<Province, 'id' | 'created_at' | 'updated_at'>) {
    await delay(500); // Simulasi delay

    const newId = this.records.length + 1;
    const currentTime = new Date().toISOString();
    const province: Province = {
      id: newId,
      ...newProvince,
      created_at: currentTime,
      updated_at: currentTime
    };
    this.records.push(province);
    return {
      success: true,
      message: 'Provinsi berhasil ditambahkan',
      province
    };
  },

  // Memperbarui provinsi berdasarkan ID
  async updateProvince(id: number, data: Partial<Province>) {
    await delay(500); // Simulasi delay

    const index = this.records.findIndex((province) => province.id === id);

    if (index === -1) {
      return {
        success: false,
        message: `Provinsi dengan ID ${id} tidak ditemukan`
      };
    }

    this.records[index] = {
      ...this.records[index],
      ...data,
      updated_at: new Date().toISOString()
    };

    return {
      success: true,
      message: `Provinsi dengan ID ${id} berhasil diperbarui`,
      province: this.records[index]
    };
  },

  // Menghapus provinsi berdasarkan ID
  async deleteProvince(id: number) {
    await delay(500); // Simulasi delay

    const index = this.records.findIndex((province) => province.id === id);

    if (index === -1) {
      return {
        success: false,
        message: `Provinsi dengan ID ${id} tidak ditemukan`
      };
    }

    this.records.splice(index, 1);

    return {
      success: true,
      message: `Provinsi dengan ID ${id} berhasil dihapus`
    };
  }
};

// Inisialisasi data provinsi contoh
fakeProvinces.initialize();
