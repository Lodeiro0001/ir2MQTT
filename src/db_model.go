package main

import (
	"errors"
	_ "github.com/mattn/go-sqlite3"
)

type Command struct {
	ID          int    `json:"id,omitempty"`
	Room        string `json:"room"`
	Device      string `json:"device"`
	CommandName string `json:"command_name"`
	IRcode      string `json:"ir_code"`
}

func (n Command) Create() error {
	database := GetConnection()

	query := `INSERT INTO commands (room, device, command_name, ir_code)
            VALUES(?, ?, ?, ?)`

	stmt, err := database.Prepare(query)
	if err != nil {
		return err
	}

	defer stmt.Close()

	r, err := stmt.Exec(n.Room, n.Device, n.CommandName, n.IRcode)
	if err != nil {
		return err
	}

	if i, err := r.RowsAffected(); err != nil || i != 1 {
		return errors.New("ERROR @Create command :(")
	}

	return nil
}

func (n *Command) GetAll() ([]Command, error) {
	database := GetConnection()
	query := `SELECT
            id, room, device, command_name, ir_code
            FROM commands`

	rows, err := database.Query(query)
	if err != nil {
		return []Command{}, err
	}

	defer rows.Close()

	commands := []Command{}

	for rows.Next() {
		rows.Scan(
			&n.ID,
			&n.Room,
			&n.Device,
			&n.CommandName,
			&n.IRcode,
		)
		commands = append(commands, *n)
	}
	return commands, nil
}

func (n Command) Delete(id int) error {
	database := GetConnection()
	query := `DELETE FROM commands
            WHERE id=?`

	stmt, err := database.Prepare(query)
	if err != nil {
		return err
	}

	defer stmt.Close()

	r, err := stmt.Exec(id)
	if err != nil {
		return err
	}

	if i, err := r.RowsAffected(); err != nil || i != 1 {
		return errors.New("ERROR @Delete command :(")
	}

	return nil
}

func (n Command) Update() error {
	database := GetConnection()
	query := `UPDATE commands set room=?, device=?, command_name=?, ir_code=?
            WHERE id=?`

	stmt, err := database.Prepare(query)
	if err != nil {
		return err
	}

	defer stmt.Close()

	r, err := stmt.Exec(n.Room, n.Device, n.CommandName, n.IRcode, n.ID)
	if err != nil {
		return err
	}

	if i, err := r.RowsAffected(); err != nil || i != 1 {
		return errors.New("ERROR @Update command :(")
	}

	return nil
}
