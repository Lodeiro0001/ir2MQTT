package main

import (
	"os"
)

func getDatabasePath() string {
	db := os.Getenv("DATABASE_PATH")
	if db == "" {
		db = "ir2MQTT.sqlite"
	}
	return db
}
