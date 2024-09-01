import { useEffect } from 'react';

function Topbar({ title }: { title: string; showBack?: boolean }) {
  // const back = () => {
  //   history.back();
  // };

  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
}

export default Topbar;
