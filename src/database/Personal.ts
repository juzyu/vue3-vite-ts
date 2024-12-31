export interface TreeItem {
  key: number | string;
  label: string;
  children: TreeItem[];
  parentId: number | string;
  age?: number;
}
