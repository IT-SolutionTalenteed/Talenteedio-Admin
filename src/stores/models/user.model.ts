export interface User {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  admin: Admin | null;
  company: Company | null;
  talent: Talent | null;
  referral: Referral | null;
  hrFirstClub: HrFirstClub | null;
  name: string;
  roles: Role[];
}

export interface Admin {
  id: string;
}

export interface Company {
  id: string;
  permission: Permission;
}

export interface Talent {
  id: string;
}

export interface Referral {
  id: string;
}

export interface HrFirstClub {
  id: string;
}

export interface Role {
  id: string;
  name: string;
  title: string;
}

export interface Permission {
  id: string;
  title: string;
  numberOfJobsPerYear: number;
  numberOfArticlesPerYear: number;
  validityPeriodOfAJob: number;
}
