import dataCities from './json/kabupaten.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type City = {
  id: number;
  name: string;
  provinceId?: number;
};

export const fakeCities = {
  records: [] as City[],

  initialize() {
    try {
      dataCities.forEach((provinceData: { id: number; kabupaten: { id: string; nama: string }[] }) => {
        provinceData.kabupaten.forEach((cityData) => {
          this.records.push({
            id: parseInt(cityData.id, 10),
            name: cityData.nama,
            provinceId: provinceData.id,
          });
        });
      });
    } catch (error) {
      console.error("Error initializing cities:", error);
      this.records = [];
    }
  },

  async getAll({ page = 1, limit = 10, search = '', provinceId }: { page?: number; limit?: number; search?: string; provinceId?: number }) {
    try {
      await delay(500);
      let cities = [...this.records];

      if (search) {
        cities = cities.filter((city) =>
          city.name.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (provinceId) {
        cities = cities.filter((city) => city.provinceId === provinceId);
      }

      cities.sort((a, b) => b.id - a.id);

      const totalCities = cities.length;
      const offset = (page - 1) * limit;
      const paginatedCities = cities.slice(offset, offset + limit);

      return {
        success: true,
        total_cities: totalCities,
        offset,
        limit,
        cities: paginatedCities,
      };
    } catch (error) {
      return { success: false, message: "Failed to get cities" };
    }
  },

  async getCityById(id: number) {
    try {
      await delay(500);
      const city = this.records.find((city) => city.id === id);

      if (!city) {
        return { success: false, message: `Kota dengan ID ${id} tidak ditemukan` };
      }

      return { success: true, city };
    } catch (error) {
      return { success: false, message: "Failed to get city" };
    }
  },

  async createCity(newCity: Omit<City, 'id'>) {
    try {
      await delay(500);

      if (!newCity.name || !newCity.provinceId) {
        return { success: false, message: "Nama dan ID Provinsi harus diisi." };
      }

      const newId = this.records.length > 0 ? Math.max(...this.records.map(c => c.id)) + 1 : 1;
      const city: City = {
        id: newId,
        ...newCity,
      };
      this.records.push(city);
      return { success: true, message: 'Kota berhasil ditambahkan', city };
    } catch (error) {
      return { success: false, message: "Gagal menambahkan kota." };
    }
  },

  async updateCity(id: number, data: Partial<City>) {
    try {
      await delay(500);
      const index = this.records.findIndex((city) => city.id === id);

      if (index === -1) {
        return { success: false, message: `Kota dengan ID ${id} tidak ditemukan` };
      }

      this.records[index] = {
        ...this.records[index],
        ...data,
      };

      return { success: true, message: `Kota dengan ID ${id} berhasil diperbarui`, city: this.records[index] };
    } catch (error) {
      return { success: false, message: "Gagal memperbarui kota." };
    }
  },

  async deleteCity(id: number) {
    try {
      await delay(500);
      const index = this.records.findIndex((city) => city.id === id);

      if (index === -1) {
        return { success: false, message: `Kota dengan ID ${id} tidak ditemukan` };
      }

      this.records.splice(index, 1);
      return { success: true, message: `Kota dengan ID ${id} berhasil dihapus` };
    } catch (error) {
      return { success: false, message: "Gagal menghapus kota." };
    }
  },
};

fakeCities.initialize();