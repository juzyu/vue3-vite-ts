import { Dexie, Table } from 'dexie';
import { TreeItem } from './Personal';

export class DB extends Dexie {
  personal!: Table<TreeItem['key']>;

  constructor(dataBaseName: string) {
    super(dataBaseName);
    this.version(1).stores({
      personal: '&key,label,parentId',
    });
  }
}

export const db = new DB('Test');
