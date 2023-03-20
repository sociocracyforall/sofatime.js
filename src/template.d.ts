/**
 * Needed so that typescript doesn't error when importing 'html?raw'
 *
 * '?raw' tells vite to load the asset as a string.
 */
declare module "*.html?raw" {
  const value: string;
  export default value;
}
