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
  // Production features
  includeCaching: boolean;
  includeBackgroundJobs: boolean;
  includeWebhooks: boolean;
  includeMultiTenancy: boolean;
  includeFeatureFlags: boolean;
  includeABTesting: boolean;
  includeMonitoring: boolean;
  includeAnalytics: boolean;
  envVars: {
    clerkPublishableKey: string;
    clerkSecretKey: string;
    supabaseUrl: string;
    supabaseAnonKey: string;
    upstashRedisUrl?: string;
    upstashRedisToken?: string;
    sentryDsn?: string;
  };
}
