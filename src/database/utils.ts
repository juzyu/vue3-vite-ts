import { liveQuery } from 'dexie';
import { Observable } from 'rxjs';
import { db, DB } from '@/database/index';
import { PromiseExtended } from '@/database/dexie';
import { useObservable } from '@vueuse/rxjs';
import { TreeItem } from '@/database/Personal';

export const usePersonalWith = <T = never>(
  fn: (db: DB) => PromiseExtended<T[]>
) => {
  const personalTree = useObservable<T[]>(
    liveQuery(() => fn(db)) as unknown as Observable<T[]>
  );

  return { personalTree };
};

export const personalListToTree = (list: TreeItem[]): TreeItem[] => {
  const buffer: Record<string, TreeItem> = {};
  list.forEach((item) => {
    const { key } = item;
    buffer[key] = item;
  });

  return list.filter((item) => {
    if (item.parentId) {
      const parent = buffer[item.parentId];
      parent.children.push(item);
      return false;
    }
    return true;
  });
};

export const useTreePersonal = () => {
  const { personalTree } = usePersonalWith<TreeItem>((db) => {
    return db.personal.toArray().then((list) => {
      const tree = personalListToTree(list);
      return tree;
    });
  });
  return { personalTree };
};
