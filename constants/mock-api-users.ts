export type UserRole = 'admin' | 'user';

export type User = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  role: UserRole;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Initial mock data
const mockUsers: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    phone_number: "081234567890",
    role: "admin"
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    phone_number: "081234567891",
    role: "user"
  },
  {
    id: 3,
    name: "Jane Smith",
    email: "jane@example.com",
    phone_number: "081234567892",
    role: "user"
  },
  {
    id: 4,
    name: "Super Admin",
    email: "superadmin@example.com",
    phone_number: "081234567893",
    role: "admin"
  },
  {
    id: 5,
    name: "Regular User",
    email: "user@example.com",
    phone_number: "081234567894",
    role: "user"
  }
];

export const fakeUsers = {
  records: [...mockUsers],

  async getAll({
    page = 1,
    limit = 10,
    search = '',
    role
  }: {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole
  }) {
    try {
      await delay(500);
      let users = [...this.records];

      if (search) {
        const searchLower = search.toLowerCase();
        users = users.filter((user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.phone_number.includes(search)
        );
      }

      if (role) {
        users = users.filter((user) => user.role === role);
      }

      users.sort((a, b) => b.id - a.id);

      const totalUsers = users.length;
      const offset = (page - 1) * limit;
      const paginatedUsers = users.slice(offset, offset + limit);

      return {
        success: true,
        total_users: totalUsers,
        offset,
        limit,
        users: paginatedUsers,
      };
    } catch (error) {
      return { success: false, message: "Failed to get users" };
    }
  },

  async getUserById(id: number) {
    try {
      await delay(500);
      const user = this.records.find((user) => user.id === id);

      if (!user) {
        return { success: false, message: `User dengan ID ${id} tidak ditemukan` };
      }

      return { success: true, user };
    } catch (error) {
      return { success: false, message: "Failed to get user" };
    }
  },

  async createUser(newUser: Omit<User, 'id'>) {
    try {
      await delay(500);

      // Validation
      if (!newUser.name || !newUser.email || !newUser.phone_number || !newUser.role) {
        return { success: false, message: "Semua field harus diisi." };
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newUser.email)) {
        return { success: false, message: "Format email tidak valid." };
      }

      // Check if email already exists
      if (this.records.some(user => user.email === newUser.email)) {
        return { success: false, message: "Email sudah terdaftar." };
      }

      // Phone number format validation (simple Indonesian format)
      const phoneRegex = /^08\d{8,11}$/;
      if (!phoneRegex.test(newUser.phone_number)) {
        return { success: false, message: "Format nomor telepon tidak valid." };
      }

      const newId = this.records.length > 0 ? Math.max(...this.records.map(u => u.id)) + 1 : 1;
      const user: User = {
        id: newId,
        ...newUser,
      };
      this.records.push(user);
      return { success: true, message: 'User berhasil ditambahkan', user };
    } catch (error) {
      return { success: false, message: "Gagal menambahkan user." };
    }
  },

  async updateUser(id: number, data: Partial<User>) {
    try {
      await delay(500);
      const index = this.records.findIndex((user) => user.id === id);

      if (index === -1) {
        return { success: false, message: `User dengan ID ${id} tidak ditemukan` };
      }

      // Email validation if email is being updated
      if (data.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          return { success: false, message: "Format email tidak valid." };
        }

        // Check if new email already exists for other users
        if (this.records.some(user => user.email === data.email && user.id !== id)) {
          return { success: false, message: "Email sudah terdaftar." };
        }
      }

      // Phone number validation if being updated
      if (data.phone_number) {
        const phoneRegex = /^08\d{8,11}$/;
        if (!phoneRegex.test(data.phone_number)) {
          return { success: false, message: "Format nomor telepon tidak valid." };
        }
      }

      this.records[index] = {
        ...this.records[index],
        ...data,
      };

      return {
        success: true,
        message: `User dengan ID ${id} berhasil diperbarui`,
        user: this.records[index]
      };
    } catch (error) {
      return { success: false, message: "Gagal memperbarui user." };
    }
  },

  async deleteUser(id: number) {
    try {
      await delay(500);
      const index = this.records.findIndex((user) => user.id === id);

      if (index === -1) {
        return { success: false, message: `User dengan ID ${id} tidak ditemukan` };
      }

      this.records.splice(index, 1);
      return { success: true, message: `User dengan ID ${id} berhasil dihapus` };
    } catch (error) {
      return { success: false, message: "Gagal menghapus user." };
    }
  }
};