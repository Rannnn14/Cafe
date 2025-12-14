import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// TODO: Replace with your actual Supabase URL and Anon Key
const supabaseUrl = 'https://ezgezixamkzepzczcdsd.supabase.co';
const supabaseAnonKey = 'sb_publishable_i90Nnw66EwpThnRC3_AdQA_RiuPvlq';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
