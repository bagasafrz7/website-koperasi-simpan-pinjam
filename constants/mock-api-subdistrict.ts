import dataSubdistricts from './json/kecamatan.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type Subdistrict = {
  id: number;
  name: string;
  cityId?: number;
};

export const fakeSubdistricts = {
  records: [] as Subdistrict[],

  initialize() {
    try {
      dataSubdistricts.forEach((cityData: { id: string; kecamatan: { id: string; nama: string }[] }) => {
        cityData.kecamatan.forEach((subdistrictData) => {
          this.records.push({
            id: parseInt(subdistrictData.id, 10),
            name: subdistrictData.nama,
            cityId: parseInt(cityData.id, 10),
          });
        });
      });
    } catch (error) {
      this.records = [];
    }
  },

  async getAll({
    page = 1,
    limit = 10,
    search = '',
    cityId
  }: {
    page?: number;
    limit?: number;
    search?: string;
    cityId?: number
  }) {
    try {
      await delay(500);
      let subdistricts = [...this.records];

      if (search) {
        subdistricts = subdistricts.filter((subdistrict) =>
          subdistrict.name.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (cityId) {
        subdistricts = subdistricts.filter((subdistrict) => subdistrict.cityId === cityId);
      }

      subdistricts.sort((a, b) => b.id - a.id);

      const totalSubdistricts = subdistricts.length;
      const offset = (page - 1) * limit;
      const paginatedSubdistricts = subdistricts.slice(offset, offset + limit);

      return {
        success: true,
        total_subdistricts: totalSubdistricts,
        offset,
        limit,
        subdistricts: paginatedSubdistricts,
      };
    } catch (error) {
      return { success: false, message: "Failed to get subdistricts" };
    }
  },

  async getSubdistrictById(id: number) {
    try {
      await delay(500);
      const subdistrict = this.records.find((subdistrict) => subdistrict.id === id);

      if (!subdistrict) {
        return { success: false, message: `Kecamatan dengan ID ${id} tidak ditemukan` };
      }

      return { success: true, subdistrict };
    } catch (error) {
      return { success: false, message: "Failed to get subdistrict" };
    }
  },

  async createSubdistrict(newSubdistrict: Omit<Subdistrict, 'id'>) {
    try {
      await delay(500);

      if (!newSubdistrict.name || !newSubdistrict.cityId) {
        return { success: false, message: "Nama dan ID Kota harus diisi." };
      }

      const newId = this.records.length > 0 ? Math.max(...this.records.map(s => s.id)) + 1 : 1;
      const subdistrict: Subdistrict = {
        id: newId,
        ...newSubdistrict,
      };
      this.records.push(subdistrict);
      return { success: true, message: 'Kecamatan berhasil ditambahkan', subdistrict };
    } catch (error) {
      return { success: false, message: "Gagal menambahkan kecamatan." };
    }
  },

  async updateSubdistrict(id: number, data: Partial<Subdistrict>) {
    try {
      await delay(500);
      const index = this.records.findIndex((subdistrict) => subdistrict.id === id);

      if (index === -1) {
        return { success: false, message: `Kecamatan dengan ID ${id} tidak ditemukan` };
      }

      this.records[index] = {
        ...this.records[index],
        ...data,
      };

      return {
        success: true,
        message: `Kecamatan dengan ID ${id} berhasil diperbarui`,
        subdistrict: this.records[index]
      };
    } catch (error) {
      return { success: false, message: "Gagal memperbarui kecamatan." };
    }
  },

  async deleteSubdistrict(id: number) {
    try {
      await delay(500);
      const index = this.records.findIndex((subdistrict) => subdistrict.id === id);

      if (index === -1) {
        return { success: false, message: `Kecamatan dengan ID ${id} tidak ditemukan` };
      }

      this.records.splice(index, 1);
      return { success: true, message: `Kecamatan dengan ID ${id} berhasil dihapus` };
    } catch (error) {
      return { success: false, message: "Gagal menghapus kecamatan." };
    }
  },
};

fakeSubdistricts.initialize();