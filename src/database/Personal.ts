export interface TreeItem {
  key: number;
  label: string;
  children: TreeItem[];
  parentId: number | string;
}
