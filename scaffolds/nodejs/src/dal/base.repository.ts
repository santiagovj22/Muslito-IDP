/**
 * BaseRepository — generic typed contract for data access.
 *
 * Extend this for every entity in your service.
 * Swap the implementation with your actual client:
 *   - DynamoDB:   @aws-sdk/lib-dynamodb  (DynamoDBDocumentClient)
 *   - PostgreSQL: drizzle-orm | prisma | pg
 *   - MongoDB:    mongoose
 */
export abstract class BaseRepository<TEntity, TId = string> {
  protected readonly tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  abstract findById(id: TId): Promise<TEntity | null>;

  abstract findAll(filters?: Partial<TEntity>): Promise<TEntity[]>;

  abstract create(data: Omit<TEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<TEntity>;

  abstract update(id: TId, data: Partial<TEntity>): Promise<TEntity | null>;

  abstract delete(id: TId): Promise<boolean>;
}

// ─── Example: DynamoDB implementation skeleton ───────────────────────────────
//
// import {
//   DynamoDBClient,
//   GetItemCommand,
//   PutItemCommand,
// } from '@aws-sdk/client-dynamodb';
// import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
//
// export class UserRepository extends BaseRepository<User> {
//   readonly #client: DynamoDBDocumentClient;
//
//   constructor() {
//     super(process.env['TABLE_NAME'] ?? 'users');
//     this.#client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
//   }
//
//   async findById(id: string): Promise<User | null> {
//     const { Item } = await this.#client.send(
//       new GetCommand({ TableName: this.tableName, Key: { pk: id } }),
//     );
//     return (Item as User) ?? null;
//   }
//   ...
// }
