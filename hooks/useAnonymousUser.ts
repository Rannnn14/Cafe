import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export function useAnonymousUser() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        let id = await AsyncStorage.getItem('anonymous_user_id');
        if (!id) {
          id = uuidv4();
          await AsyncStorage.setItem('anonymous_user_id', id);
        }
        setUserId(id);
      } catch (e) {
        console.error('Failed to get anonymous user id', e);
      }
    };
    getUserId();
  }, []);

  return userId;
}
