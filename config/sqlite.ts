import path from 'path';
import mkdirp from 'mkdirp';
import sqlite3 from 'sqlite3';
import sqlite, { open } from 'sqlite';

type SQLiteDB = sqlite.Database<sqlite3.Database, sqlite3.Statement>;

export default class SQLite {
  private db: SQLiteDB | undefined;

  private path: string;

  constructor() {
    this.path = path.join(__dirname, '../tmp');
  }

  /**
   * Return the SQLite database instance.
   */
  public getDB(): SQLiteDB | undefined {
    return this.db;
  }

  /**
   * Open the SQLite DB and initialize default tables.
   */
  public async open(): Promise<SQLiteDB> {
    await this.mkdirp();

    const db = await open({
      filename: path.join(__dirname, '../tmp/sqlite.db'),
      driver: sqlite3.Database,
    });

    this.db = db;

    await this.init();

    return db;
  }

  /**
   * Create default tables into the SQLite DB.
   *
   * @param db Empty SQLite DB.
   */
  private async init(): Promise<void> {
    if (!this.db) {
      return;
    }

    await this.db.exec(`CREATE TABLE IF NOT EXISTS users (
      account_name VARCHAR(100) PRIMARY KEY,
      jwt VARCHAR(255),
      poesessid VARCHAR(255)
    );`);
  }

  /**
   * Prepare directory for the DB.
   */
  private async mkdirp(): Promise<void> {
    await mkdirp(this.path);
  }
}
