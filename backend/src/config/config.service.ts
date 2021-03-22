import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from '../SnakeNamingStrategy';

require('dotenv').config();

class ConfigService {

  constructor(
    private env: { [k: string]: string | undefined }
    ) { }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.getValue('DB_HOST'),
      port: parseInt(this.getValue('DB_PORT')),
      username: this.getValue('DB_USER'),
      password: this.getValue('DB_PASSWORD'),
      database: this.getValue('DB_DATABASE'),

      entities: ['dist/**/*.entity{.ts,.js}'],
      namingStrategy: new SnakeNamingStrategy(),
      logging: true,
      // migrationsTableName: 'migration',

      // migrations: ['src/migration/*.ts'],

      // cli: {
      //   migrationsDir: 'src/migration',
      // },

      // ssl: this.isProduction(),
    };
  }

}

const configService = new ConfigService(process.env)
  .ensureValues([
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    'DB_PASSWORD',
    'DB_DATABASE',
    'DB_TYPE',
    'DB_ENTITIES'
  ]);

export { configService };