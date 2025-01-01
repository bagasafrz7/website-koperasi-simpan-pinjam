export type Cooperative = {
  id: number;
  name: string;
  province_id: number;
  city_id: number;
  subdistrict_id: number;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Initial mock data
const mockCooperatives: Cooperative[] = [
  {
    id: 1,
    name: "Koperasi Maju Bersama",
    province_id: 35,
    city_id: 3571,
    subdistrict_id: 357101
  },
  {
    id: 2,
    name: "Koperasi Sejahtera",
    province_id: 31,
    city_id: 3171,
    subdistrict_id: 317101
  },
  {
    id: 3,
    name: "Koperasi Makmur",
    province_id: 32,
    city_id: 3271,
    subdistrict_id: 327101
  },
  {
    id: 4,
    name: "Koperasi Bina Usaha",
    province_id: 33,
    city_id: 3371,
    subdistrict_id: 337101
  },
  {
    id: 5,
    name: "Koperasi Mandiri",
    province_id: 34,
    city_id: 3471,
    subdistrict_id: 347101
  }
];

export const fakeCooperatives = {
  records: [...mockCooperatives] as Cooperative[],

  initialize() {
    try {
      this.records = [...mockCooperatives];
    } catch (error) {
      this.records = [];
    }
  },

  async getAll({ page = 1, limit = 10, search = '', province_id, city_id, subdistrict_id }: {
    page?: number;
    limit?: number;
    search?: string;
    province_id?: number;
    city_id?: number;
    subdistrict_id?: number;
  }) {
    try {
      await delay(500);
      let cooperatives = [...this.records];

      if (search) {
        const searchLower = search.toLowerCase();
        cooperatives = cooperatives.filter((coop) =>
          coop.name.toLowerCase().includes(searchLower)
        );
      }

      if (province_id) {
        cooperatives = cooperatives.filter((coop) => coop.province_id === province_id);
      }

      if (city_id) {
        cooperatives = cooperatives.filter((coop) => coop.city_id === city_id);
      }

      if (subdistrict_id) {
        cooperatives = cooperatives.filter((coop) => coop.subdistrict_id === subdistrict_id);
      }

      cooperatives.sort((a, b) => b.id - a.id);

      const totalCooperatives = cooperatives.length;
      const offset = (page - 1) * limit;
      const paginatedCooperatives = cooperatives.slice(offset, offset + limit);

      return {
        success: true,
        total_cooperatives: totalCooperatives,
        offset,
        limit,
        cooperatives: paginatedCooperatives,
      };
    } catch (error) {
      return { success: false, message: "Failed to get cooperatives" };
    }
  },

  async getCooperativeById(id: number) {
    try {
      await delay(500);
      const cooperative = this.records.find((coop) => coop.id === id);

      if (!cooperative) {
        return { success: false, message: `Koperasi dengan ID ${id} tidak ditemukan` };
      }

      return { success: true, cooperative };
    } catch (error) {
      return { success: false, message: "Failed to get cooperative" };
    }
  },

  async createCooperative(newCooperative: Omit<Cooperative, 'id'>) {
    try {
      await delay(500);

      if (!newCooperative.name || !newCooperative.province_id ||
        !newCooperative.city_id || !newCooperative.subdistrict_id) {
        return { success: false, message: "Semua field harus diisi." };
      }

      // Here you might want to add validation to check if the IDs exist in their respective tables

      const newId = this.records.length > 0 ? Math.max(...this.records.map(c => c.id)) + 1 : 1;
      const cooperative: Cooperative = {
        id: newId,
        ...newCooperative,
      };

      this.records.push(cooperative);
      return { success: true, message: 'Koperasi berhasil ditambahkan', cooperative };
    } catch (error) {
      return { success: false, message: "Gagal menambahkan koperasi." };
    }
  },

  async updateCooperative(id: number, data: Partial<Omit<Cooperative, 'id'>>) {
    try {
      await delay(500);
      const index = this.records.findIndex((coop) => coop.id === id);

      if (index === -1) {
        return { success: false, message: `Koperasi dengan ID ${id} tidak ditemukan` };
      }

      // Here you might want to add validation for the updated fields

      this.records[index] = {
        ...this.records[index],
        ...data,
      };

      return {
        success: true,
        message: `Koperasi dengan ID ${id} berhasil diperbarui`,
        cooperative: this.records[index]
      };
    } catch (error) {
      return { success: false, message: "Gagal memperbarui koperasi." };
    }
  },

  async deleteCooperative(id: number) {
    try {
      await delay(500);
      const index = this.records.findIndex((coop) => coop.id === id);

      if (index === -1) {
        return { success: false, message: `Koperasi dengan ID ${id} tidak ditemukan` };
      }

      this.records.splice(index, 1);
      return { success: true, message: `Koperasi dengan ID ${id} berhasil dihapus` };
    } catch (error) {
      return { success: false, message: "Gagal menghapus koperasi." };
    }
  }
};

fakeCooperatives.initialize();