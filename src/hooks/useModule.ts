import { useEffect, useState } from 'react';
import { loadModule, type ModuleContent } from '../lib/content';

export function useModuleContent(id: string | undefined) {
  const [data, setData] = useState<ModuleContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    setData(null);
    setError(null);
    if (!id) return;
    loadModule(id).then(
      (d) => alive && setData(d),
      (e: Error) => alive && setError(e.message)
    );
    return () => {
      alive = false;
    };
  }, [id]);
  return { data, error };
}

export function useAllModules(ids: string[]) {
  const [data, setData] = useState<ModuleContent[] | null>(null);
  const key = ids.join(',');
  useEffect(() => {
    let alive = true;
    Promise.all(key ? key.split(',').map(loadModule) : []).then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
  }, [key]);
  return data;
}
