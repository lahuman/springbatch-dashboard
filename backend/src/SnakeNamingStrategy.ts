import { DefaultNamingStrategy, NamingStrategyInterface } from "typeorm";
import { snakeCase } from "typeorm/util/StringUtils";

export class SnakeNamingStrategy extends DefaultNamingStrategy
  implements NamingStrategyInterface {
  columnName(
    propertyName: string,
    customName: string | undefined,
    embeddedPrefixes: string[]
  ): string {
    const columnName = snakeCase(customName || propertyName);

    return embeddedPrefixes.length
      ? `${snakeCase(embeddedPrefixes.join("_"))}_${columnName}`.toUpperCase()
      : columnName.toUpperCase();
  }

  tableName(targetName: string, userSpecifiedName: string | undefined): string{
    const tableName = snakeCase(userSpecifiedName || targetName);

    return tableName.toUpperCase();
  }

  // relationName(propertyName: string): string {
  //   return snakeCase(propertyName);
  // }

  // joinColumnName(relationName: string, referencedColumnName: string): string {
  //   return `${relationName}_${referencedColumnName}`;
  // }

  // joinTableName(
  //   firstTableName: string,
  //   secondTableName: string,
  //   firstPropertyName: string,
  //   secondPropertyName: string
  // ): string {
  //   return `${firstTableName}_${secondTableName}`;
  // }

  // joinTableColumnName(
  //   tableName: string,
  //   propertyName: string,
  //   columnName?: string
  // ): string {
  //   return `${tableName}_${columnName || propertyName}`;
  // }
}