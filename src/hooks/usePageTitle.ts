import { useEffect } from 'react';

export const usePageTitle = (title: string) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    
    // Cleanup function to restore previous title when component unmounts
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
};
