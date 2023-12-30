export const getConfig = (): AppConfig => {
  return {
    port: parseInt(process.env.PORT as string, 10) || 3000,
    jwtSecret: process.env.JWT_SECRET as string,
    logLevel: process.env.LOG_LEVEL || 'info',
    database: {
      host: process.env.DB_HOST as string,
      type: process.env.DB_TYPE as string,
      port: parseInt(process.env.DB_PORT as string, 10) || 5432,
      user: process.env.DB_USER as string,
      password: process.env.DB_PASSWORD as string,
      dbName: process.env.DB_NAME as string,
    },
    cache: {
      host: process.env.REDIS_HOST as string,
      port: parseInt(process.env.REDIS_PORT as string, 10) || 6379,
      password: process.env.REDIS_PASSWORD as string,
    },
    mail: {
      from: process.env.MAIL_FROM as string,
      transportOptions: {
        host: process.env.MAIL_HOST as string,
        port: parseInt(process.env.MAIL_PORT as string, 10),
        auth: {
          user: process.env.MAIL_AUTH_USER as string,
          pass: process.env.MAIL_AUTH_PASS as string,
        },
      },
    },
    recaptcha: {
      secret_key: process.env.RECAPTHA_SECRET_KEY as string,
    },
    gcloud: {
      client_id: process.env.GCOUD_CLIENT_ID as string,
    },
  };
};

export interface AppConfig {
  port: number;
  jwtSecret: string;
  logLevel: string;
  database: DbConfig;
  cache: CacheConfig;
  mail: MailConfig;
  recaptcha: ReCaptcha;
  gcloud: GCloud;
}

export interface DbConfig {
  host: string;
  port: number;
  type: string;
  user: string;
  password: string;
  dbName: string;
}

export interface CacheConfig {
  host: string;
  port: number;
  password: string;
}

export interface MailConfig {
  from: string;
  transportOptions: {
    host: string;
    port: number;
    auth: {
      user: string;
      pass: string;
    };
  };
}

export interface ReCaptcha {
  secret_key: string;
}

export interface GCloud {
  client_id: string;
}
