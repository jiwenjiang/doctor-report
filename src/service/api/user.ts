import useSWR from 'swr';

export function useLogin() {
  const { data, error } = useSWR('/login');

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
}
