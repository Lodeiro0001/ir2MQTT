package main

import (
	"database/sql"
)

var database *sql.DB

func GetConnection() *sql.DB {
	if database != nil {
		return database
	}

	database, err = sql.Open("sqlite3", getDatabasePath())
	if err != nil {
		panic(err)
	}
	return database
}

func CreateDatabase() error {
	database := GetConnection()

	query := `CREATE TABLE IF NOT EXISTS commands (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            room VARCHAR(64) NULL,
            device VARCHAR(64) NULL,
            command_name VARCHAR(64) NULL,
            ir_code VARCHAR(10) NULL
         );`

	_, err := database.Exec(query)
	if err != nil {
		return err
	}

	return nil
}
