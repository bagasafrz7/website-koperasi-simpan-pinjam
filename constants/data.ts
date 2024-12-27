import { NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const navItemsAdmin: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Master Data',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'settings',
    isActive: true,
    items: [
      {
        title: 'Data Koperasi',
        url: '/admin/master-data/koperasi',
        icon: 'userPen',
        shortcut: ['k', 'k']
      },
      {
        title: 'Data Wilayah',
        url: '/admin/master-data/wilayah/provinces',
        icon: 'userPen',
        shortcut: ['w', 'w']
      },
      {
        title: 'Data Penggguna',
        url: '/admin/master-data/users',
        icon: 'userPen',
        shortcut: ['p', 'p']
      },
      {
        title: 'Data Umum',
        url: '/admin/master-data/umum',
        icon: 'userPen',
        shortcut: ['u', 'u']
      },
    ]
  },
  {
    title: 'Laporan',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'folderUp',
    isActive: true,
    items: [
      {
        title: 'Data Simpanan',
        url: '/admin/laporan/simpanan',
        icon: 'userPen',
        shortcut: ['ls', 'ls']
      },
      {
        title: 'Data Pinjaman',
        url: '/admin/laporan/Pinjaman',
        icon: 'userPen',
        shortcut: ['lp', 'lp']
      },
      {
        title: 'Data Umum',
        url: '/admin/laporan/umum',
        icon: 'userPen',
        shortcut: ['lu', 'lu']
      },
    ]
  }
];

export const navItemsUser: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Profile',
    url: '/user/profile',
    icon: 'userPen',
    shortcut: ['pr', 'pr'],
    items: []
  },
  {
    title: 'Ajukan Simpan/Pinjam',
    url: '/user/ajukan',
    icon: 'save',
    shortcut: ['aj', 'aj'],
    items: []
  },
  {
    title: 'Riwayat Transaksi',
    url: '/user/riwayat-transaksi',
    icon: 'arrowLeftRight',
    shortcut: ['rt', 'rt'],
    items: []
  }
]
