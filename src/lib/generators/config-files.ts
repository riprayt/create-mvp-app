import fs from 'fs/promises';

/**
 * Generates project configuration files (Prettier, VSCode settings)
 */
export async function generateConfigFiles(): Promise<void> {
  // Prettier config
  await fs.writeFile('.prettierrc', JSON.stringify({
    semi: true,
    trailingComma: 'es5',
    singleQuote: false,
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
  }, null, 2));

  // VS Code settings for AI development
  await fs.mkdir('.vscode', { recursive: true });
  const vscodeSettings = {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    },
    "typescript.tsdk": "node_modules/typescript/lib",
    "typescript.enablePromptUseWorkspaceTsdk": true,
    "files.associations": {
      "*.css": "tailwindcss"
    },
    "tailwindCSS.experimental.classRegex": [
      ["cva\\(([^)]*)\\)", "[\"\`]([^\"\`]*).*?[\"\`]"],
      ["cn\\(([^)]*)\\)", "[\"\`]([^\"\`]*).*?[\"\`]"]
    ]
  };
  await fs.writeFile('.vscode/settings.json', JSON.stringify(vscodeSettings, null, 2));
}
