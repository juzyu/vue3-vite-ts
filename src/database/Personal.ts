export type Family = {
  id: number;
  description: string;
  address: string;
  familyMember: Personal[];
};

export type Personal = {
  key: string;
  label: string;
  age: number;
  gender: string;
  children: Personal[];
  parentId: number | string;
};

export interface TreeItem {
  key: number;
  label: string;
  age: number;
  gender: string;
  children: TreeItem[];
  parentId: number | string;
}
