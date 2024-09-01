import { useEffect } from 'react';

export default function useCheckUser() {
  useEffect(() => {
    if (!sessionStorage.token) {
      window.location.href = `/?returnUrl=${encodeURIComponent(window.location.href)}`;
    }
  }, []);

  return null;
}
