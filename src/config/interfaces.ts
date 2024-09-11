// interfaces.ts
export interface DbConfig {
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT?: string;
  DIALECT: string;
  SEEDER_STORAGE?: string;
  POSTGRES_URL?: string;
  USE_ENV_VARIABLE?: string;
  dialectOptions?: {
    ssl?: {
      require: boolean;
      rejectUnauthorized: boolean;
    };
  };
}

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "strict" | "lax" | "none";
}


export interface Config {
  development: {
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_HOST: string;
    DB_PORT?: string;
    DIALECT: string;
    SEEDER_STORAGE?: string;
    POSTGRES_URL?: string;
    dialectOptions?: {
      ssl?: {
        require: boolean;
        rejectUnauthorized: boolean;
      };
    };
    USE_ENV_VARIABLE?: string;
  };
  test: {
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_HOST: string;
    DB_PORT?: string;
    DIALECT: string;
    SEEDER_STORAGE?: string;
    POSTGRES_URL?: string;
    dialectOptions?: {
      ssl?: {
        require: boolean;
        rejectUnauthorized: boolean;
      };
    };
    USE_ENV_VARIABLE?: string;
  };
  production: {
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_HOST: string;
    DB_PORT?: string;
    DIALECT: string;
    SEEDER_STORAGE?: string;
    POSTGRES_URL?: string;
    dialectOptions?: {
      ssl?: {
        require: boolean;
        rejectUnauthorized: boolean;
      };
    };
    USE_ENV_VARIABLE?: string;
  };
  [key: string]: any; 
}
