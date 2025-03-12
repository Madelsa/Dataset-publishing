/**
 * Configuration for database connections
 * This allows us to manage different environments (development, test, production)
 */

export const dbConfig = {
  development: {
    url: process.env.DATABASE_URL,
    ssl: false,
  },
  production: {
    url: process.env.DATABASE_URL,
    ssl: true,
  },
  test: {
    url: process.env.TEST_DATABASE_URL || process.env.DATABASE_URL,
    ssl: false,
  },
};

/**
 * Get the appropriate database configuration based on the current environment
 */
export const getDbConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return dbConfig[env as keyof typeof dbConfig] || dbConfig.development;
}; 