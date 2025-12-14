import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://liinqabrivmcgiaejyja.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpaW5xYWJyaXZtY2dpYWVqeWphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MDc3OTAsImV4cCI6MjA4MDM4Mzc5MH0.0s4UiTF0el2W4EZx6CBt5q1GHdFLlvxi3YNlSqFDY5U'
);
