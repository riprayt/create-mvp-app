/**
 * Converts a kebab-case project name to Title Case brand name
 * Example: "my-awesome-app" -> "My Awesome App"
 */
export function projectNameToBrandName(projectName: string): string {
  return projectName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
