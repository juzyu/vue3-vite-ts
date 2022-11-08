import { Dexie, Table } from 'dexie';
import { Family, Personal } from './Personal';

export class DB extends Dexie {
  personal!: Table<Personal['key']>;
  family!: Table<Family['id']>;

  constructor(dataBaseName: string) {
    super(dataBaseName);
    this.version(1).stores({
      personal: '&key,label,parentId',
      family: '&id,description',
    });
  }
}

export const db = new DB('Test');
