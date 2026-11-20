import { supabase } from '../../supabase.js';
import { friendlyError } from './friendlyError.js';

export class BaseService {
  get client() {
    if (!supabase) throw new Error('Supabase belum dikonfigurasi. Isi config.js lalu jalankan ulang aplikasi.');
    return supabase;
  }

  unwrap(response) {
    if (response.error) {
      const error = new Error(friendlyError(response.error));
      error.original = response.error;
      throw error;
    }
    return response.data;
  }
}

