import { useEffect, useState } from 'react';

export default function useFetch<D>(url: RequestInfo) {
  let doUpdate = true;
  const [ data, setData ] = useState<D | null>(null);
  const [ error, setError ] = useState<any>(null);
  const [ pending, setPending ] = useState<boolean>(true);

  useEffect(() => {
    fetch(url)
      .then(async res => {
        const json: D = await res.json();
        if (doUpdate) {
          setData(json);
        }
      }).catch((err) => {
        if (doUpdate) {
          setError(err);
        }
      }).finally(() => setPending(false));

    return () => {
      doUpdate = false;
    }
  }, []);

  return [ data, error, pending ] as [ D | null, any, boolean ];
}
