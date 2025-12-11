import { SafePromise } from '../common/safeApply';
export const tvvinsFetch = async function(
  url: string,
  
){
  const baseUrl = '/';
  const res = await SafePromise(fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      url,
    }),
  }));
}