export enum MemberRole {
  SUPER_ADMIN = 'Super Admin',
  CHAIRMAN = 'Ketua',
  VICE_CHAIRMAN = 'Wakil Ketua',
  TREASURER = 'Bendahara',
  SECRETARY = 'Sekretaris',
  MEMBER = 'Anggota'
}

export interface Member {
  id: string;
  name: string;
  role: MemberRole;
  avatar: string;
  joinedAt: string;
  status: 'active' | 'inactive';
  email?: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
}

export interface EventProposal {
  id: string;
  title: string;
  date: string;
  description: string;
  budget: number;
  status: 'draft' | 'approved' | 'completed';
}

export interface NavItem {
  label: string;
  icon: any; // Using lucide-react icons
  path: string;
}