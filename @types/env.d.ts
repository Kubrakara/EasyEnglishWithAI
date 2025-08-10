declare module "expo-constants" {
  export interface Constants {
    expoConfig?: {
      extra?: {
        GEMINI_API_KEY?: string;
        SUPABASE_URL?: string;
        SUPABASE_ANON_KEY?: string;
      };
    };
  }
}
