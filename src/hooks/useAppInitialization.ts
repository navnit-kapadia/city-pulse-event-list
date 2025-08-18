import { useEffect } from 'react';

import { useAuthStore } from '@/store/authStore';
import { useEventStore } from '@/store/eventStore';

export const useAppInitialization = (): void => {
  const { user } = useAuthStore();
  const { loadFavorites } = useEventStore();

  useEffect(() => {
    // Load favorites when the app initializes and user is authenticated
    if (user) {
      void loadFavorites();
    }
  }, [user, loadFavorites]);
};
