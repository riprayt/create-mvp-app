import fs from 'fs/promises';
import path from 'path';
import Mustache from 'mustache';
import { fileURLToPath } from 'url';
import type { ProjectConfig } from '../../types.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generates .cursorrules file with AI development guidelines and scalability best practices
 * Uses Mustache templating for maintainable content separation
 */
export async function generateCursorRules(config: ProjectConfig): Promise<void> {
  // Read template file from assets directory
  const templatePath = path.join(__dirname, '../../../assets/cursorrules.template.md');
  const template = await fs.readFile(templatePath, 'utf-8');
  
  // Prepare template variables
  const templateVars = {
    projectName: config.projectName,
    includeAuth: config.includeAuth,
    includeDb: config.includeDb,
    includeCaching: config.includeCaching,
    includeBackgroundJobs: config.includeBackgroundJobs,
    includeMonitoring: config.includeMonitoring,
    includeTests: config.includeTests,
  };
  
  // Render template with Mustache
  const cursorRules = Mustache.render(template, templateVars);
  
  // Write output file
  await fs.writeFile('.cursorrules', cursorRules);
}
