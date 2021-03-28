import { TypeOrmModuleOptions  } from '@nestjs/typeorm';
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

  private getDBdbTypeorm(): "mysql" | "mariadb" | "postgres" | "cockroachdb" | "sqlite" | "mssql" | "sap" | "oracle" | "cordova" | "nativescript" | "react-native" | "sqljs" | "mongodb" | "aurora-data-api" | "aurora-data-api-pg" | "expo" | "better-sqlite3" {
    let dbTypeorm: "mysql" | "mariadb" | "postgres" | "cockroachdb" | "sqlite" | "mssql" | "sap" | "oracle" | "cordova" | "nativescript" | "react-native" | "sqljs" | "mongodb" | "aurora-data-api" | "aurora-data-api-pg" | "expo" | "better-sqlite3";

    try {
      switch( this.getValue('DB_dbTypeorm')){
        case "mysql" :
          return "mysql";
        case "mariadb" :
          return "mariadb";
        case "postgres" :
          return "postgres";
        case "cockroachdb" :
          return "cockroachdb";
        case "sqlite" :
          return "sqlite";
        case "mssql" :
          return "mssql";
        case "sap" :
          return "sap";
        case "oracle" :
          return "oracle";
        case "cordova" :
          return "cordova";
        case "nativescript" :
          return "nativescript";
        case "react-native" :
          return "react-native";
        case "sqljs" :
          return "sqljs";
        case "mongodb" :
          return "mongodb";
        case "aurora-data-api" :
          return "aurora-data-api";
        case "aurora-data-api-pg" :
          return "aurora-data-api-pg";
        case "expo" :
          return "expo";
        case "better-sqlite3":
          return "better-sqlite3";
        default : 
          return "mysql";
      }
    } catch (e) {
      dbTypeorm = 'mysql';
    }
    return dbTypeorm;
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions  {
  
    const defaultOptions: any = {
      type: this.getValue('DB_TYPE'),
      host: this.getValue('DB_HOST'),
      port: parseInt(this.getValue('DB_PORT')),
      username: this.getValue('DB_USER'),
      password: this.getValue('DB_PASSWORD'),
      database: this.getValue('DB_DATABASE'),

      entities: ['dist/**/*.entity{.ts,.js}'],
      namingStrategy: new SnakeNamingStrategy(),
      logging: true,
    }

    return defaultOptions;

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