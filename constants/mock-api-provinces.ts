import dataProvinces from './json/provinces.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type Province = {
  id: number;
  name: string;
};

// Mock province data store
export const fakeProvinces = {
  records: [] as Province[],

  // Inisialisasi dengan data dari JSON
  initialize() {
    this.records = dataProvinces.map((province: { id: string; nama: string }) => ({
      id: parseInt(province.id, 10),
      name: province.nama
    }));
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

    return {
      success: true,
      message: `Provinsi dengan ID ${id} ditemukan`,
      province
    };
  },

  // Menambahkan provinsi baru
  async createProvince(newProvince: Omit<Province, 'id'>) {
    await delay(500); // Simulasi delay

    const newId = this.records.length > 0 ? Math.max(...this.records.map(c => c.id)) + 1 : 1;
    const province: Province = {
      id: newId,
      ...newProvince
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
      ...data
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
