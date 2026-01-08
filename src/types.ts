export interface ProjectConfig {
  projectName: string;
  includeAuth: boolean;
  includeDb: boolean;
  includeUI: boolean;
  includeBlocks: boolean;
  includeTests: boolean;
  initGit: boolean;
  debugMode: boolean;
  openInVSCode?: boolean;
  envVars: {
    clerkPublishableKey: string;
    clerkSecretKey: string;
    supabaseUrl: string;
    supabaseAnonKey: string;
  };
}
