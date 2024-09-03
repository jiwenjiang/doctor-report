import { useEffect } from 'react';

export default function useCheckUser() {
  useEffect(() => {
    if (!localStorage.token) {
      window.location.href = `/?returnUrl=${encodeURIComponent(window.location.href)}`;
    }
  }, []);

  return null;
}
