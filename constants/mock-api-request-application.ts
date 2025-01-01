export type ApplicationRequest = {
  id: number;
  user_id: number;
  user_fullname?: string;
  cooperative_id: number;
  amount: number;
  date: string;
  type: 'Simpan' | 'Pinjam'; // Jenis pengajuan
  status: 'Diajukan' | 'Disetujui' | 'Ditolak';
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockApplicationRequests: ApplicationRequest[] = [
  {
    id: 1,
    user_id: 101,
    cooperative_id: 1,
    amount: 1000000,
    date: "2025-01-01",
    type: "Simpan",
    status: "Diajukan"
  },
  {
    id: 2,
    user_id: 102,
    cooperative_id: 2,
    amount: 2000000,
    date: "2025-01-05",
    type: "Pinjam",
    status: "Disetujui"
  }
];

export const fakeApplicationRequests = {
  records: [...mockApplicationRequests] as ApplicationRequest[],

  initialize() {
    try {
      this.records = [...mockApplicationRequests];
    } catch (error) {
      this.records = [];
    }
  },

  async getAll({ page = 1, limit = 10, user_id, cooperative_id, type }: {
    page?: number;
    limit?: number;
    user_id?: number;
    cooperative_id?: number;
    type?: 'Simpan' | 'Pinjam';
  }) {
    try {
      await delay(500);
      let requests = [...this.records];

      if (user_id) {
        requests = requests.filter((request) => request.user_id === user_id);
      }

      if (cooperative_id) {
        requests = requests.filter((request) => request.cooperative_id === cooperative_id);
      }

      if (type) {
        requests = requests.filter((request) => request.type === type);
      }

      const totalRequests = requests.length;
      const offset = (page - 1) * limit;
      const paginatedRequests = requests.slice(offset, offset + limit);

      return {
        success: true,
        total_requests: totalRequests,
        offset,
        limit,
        requests: paginatedRequests,
      };
    } catch (error) {
      return { success: false, message: "Gagal mendapatkan data pengajuan" };
    }
  },

  async createRequest(newRequest: Omit<ApplicationRequest, 'id' | 'status'>) {
    try {
      await delay(500);

      if (!newRequest.user_id || !newRequest.cooperative_id || !newRequest.amount || !newRequest.date || !newRequest.type) {
        return { success: false, message: "Semua field harus diisi." };
      }

      const newId = this.records.length > 0 ? Math.max(...this.records.map(r => r.id)) + 1 : 1;
      const request: ApplicationRequest = {
        id: newId,
        status: 'Diajukan',
        ...newRequest,
      };

      this.records.push(request);
      return { success: true, message: 'Pengajuan berhasil dibuat', request };
    } catch (error) {
      return { success: false, message: "Gagal membuat pengajuan." };
    }
  },

  async updateRequestStatus(id: number, status: 'Disetujui' | 'Ditolak') {
    try {
      await delay(500);
      const index = this.records.findIndex((r) => r.id === id);

      if (index === -1) {
        return { success: false, message: `Pengajuan dengan ID ${id} tidak ditemukan` };
      }

      this.records[index].status = status;

      return {
        success: true,
        message: `Status pengajuan dengan ID ${id} berhasil diperbarui`,
        request: this.records[index]
      };
    } catch (error) {
      return { success: false, message: "Gagal memperbarui status pengajuan." };
    }
  }
};

fakeApplicationRequests.initialize();
