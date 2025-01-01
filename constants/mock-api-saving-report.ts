export type SavingReport = {
  id: number;
  cooperative_id: number;
  user_id: number;
  full_name: string;
  amount: number;
  date: string;
  type: string; // Misalnya "Simpanan Pokok", "Simpanan Wajib"
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Initial mock data
const mockSavingReports: SavingReport[] = [
  {
    id: 1,
    cooperative_id: 1,
    user_id: 101,
    full_name: "Budi Santoso",
    amount: 1000000,
    date: "2025-01-01",
    type: "Simpanan Pokok"
  },
  {
    id: 2,
    cooperative_id: 1,
    user_id: 102,
    full_name: "Siti Aminah",
    amount: 500000,
    date: "2025-01-05",
    type: "Simpanan Wajib"
  },
  {
    id: 3,
    cooperative_id: 2,
    user_id: 103,
    full_name: "Ahmad Fauzi",
    amount: 750000,
    date: "2025-01-10",
    type: "Simpanan Pokok"
  },
  {
    id: 4,
    cooperative_id: 3,
    user_id: 104,
    full_name: "Dewi Lestari",
    amount: 200000,
    date: "2025-01-15",
    type: "Simpanan Wajib"
  }
];

export const fakeSavingReports = {
  records: [...mockSavingReports] as SavingReport[],

  initialize() {
    try {
      this.records = [...mockSavingReports];
    } catch (error) {
      this.records = [];
    }
  },

  async getAll({ page = 1, limit = 10, cooperative_id, search = '', startDate, endDate }: {
    page?: number;
    limit?: number;
    cooperative_id?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
  }) {
    try {
      await delay(500);
      let reports = [...this.records];

      if (cooperative_id) {
        reports = reports.filter((report) => report.cooperative_id === cooperative_id);
      }

      if (search) {
        const searchLower = search.toLowerCase();
        reports = reports.filter((report) =>
          report.type.toLowerCase().includes(searchLower) ||
          report.full_name.toLowerCase().includes(searchLower));
      }

      if (startDate) {
        const start = new Date(startDate).getTime();
        reports = reports.filter((report) => new Date(report.date).getTime() >= start);
      }

      if (endDate) {
        const end = new Date(endDate).getTime();
        reports = reports.filter((report) => new Date(report.date).getTime() <= end);
      }

      reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const totalReports = reports.length;
      const offset = (page - 1) * limit;
      const paginatedReports = reports.slice(offset, offset + limit);

      return {
        success: true,
        total_reports: totalReports,
        offset,
        limit,
        reports: paginatedReports,
      };
    } catch (error) {
      return { success: false, message: "Gagal mendapatkan laporan simpanan" };
    }
  },

  async getReportById(id: number) {
    try {
      await delay(500);
      const report = this.records.find((r) => r.id === id);

      if (!report) {
        return { success: false, message: `Laporan dengan ID ${id} tidak ditemukan` };
      }

      return { success: true, report };
    } catch (error) {
      return { success: false, message: "Failed to get saving report" };
    }
  },

  async createReport(newReport: Omit<SavingReport, 'id'>) {
    try {
      await delay(500);

      if (!newReport.cooperative_id || !newReport.amount || !newReport.date || !newReport.type) {
        return { success: false, message: "Semua field harus diisi." };
      }

      const newId = this.records.length > 0 ? Math.max(...this.records.map(r => r.id)) + 1 : 1;
      const report: SavingReport = {
        id: newId,
        ...newReport,
      };

      this.records.push(report);
      return { success: true, message: 'Laporan simpanan berhasil ditambahkan', report };
    } catch (error) {
      return { success: false, message: "Gagal menambahkan laporan simpanan." };
    }
  },

  async updateReport(id: number, data: Partial<Omit<SavingReport, 'id'>>) {
    try {
      await delay(500);
      const index = this.records.findIndex((r) => r.id === id);

      if (index === -1) {
        return { success: false, message: `Laporan dengan ID ${id} tidak ditemukan` };
      }

      this.records[index] = {
        ...this.records[index],
        ...data,
      };

      return {
        success: true,
        message: `Laporan dengan ID ${id} berhasil diperbarui`,
        report: this.records[index]
      };
    } catch (error) {
      return { success: false, message: "Gagal memperbarui laporan simpanan." };
    }
  },

  async deleteReport(id: number) {
    try {
      await delay(500);
      const index = this.records.findIndex((r) => r.id === id);

      if (index === -1) {
        return { success: false, message: `Laporan dengan ID ${id} tidak ditemukan` };
      }

      this.records.splice(index, 1);
      return { success: true, message: `Laporan dengan ID ${id} berhasil dihapus` };
    } catch (error) {
      return { success: false, message: "Gagal menghapus laporan simpanan." };
    }
  }
};

fakeSavingReports.initialize();
