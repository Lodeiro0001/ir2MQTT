package main

import (
	"encoding/json"
	"github.com/rs/cors"
	"log"
	"net/http"
	"strconv"
)

func main() {

	mux := http.NewServeMux()
	fileServer := http.FileServer(http.Dir("./gui"))

	if err := CreateDatabase(); err != nil {
		log.Fatal(err)
	}

	mux.Handle("/", http.StripPrefix("/", fileServer))
	mux.HandleFunc("/commands", CommandsHandler)

	handler := cors.Default().Handler(mux)

	c := cors.New(cors.Options{
		AllowedMethods: []string{"GET", "POST", "DELETE", "PUT"},
	})
	handler = c.Handler(mux)

	http.ListenAndServe(":8420", handler)

}

func CommandsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		GetCommands(w, r)
	case http.MethodPost:
		CreateCommands(w, r)
	case http.MethodDelete:
		DeleteCommands(w, r)
	case http.MethodPut:
		UpdateCommands(w, r)
	default:
		http.Error(w, "Incorrect method :(",
			http.StatusBadRequest)
		return
	}
}

func GetCommands(w http.ResponseWriter, r *http.Request) {
	n := new(Command)

	commands, err := n.GetAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	j, err := json.Marshal(commands)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	w.Write(j)
}

func CreateCommands(w http.ResponseWriter, r *http.Request) {
	var command Command

	err := json.NewDecoder(r.Body).Decode(&command)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = command.Create()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func DeleteCommands(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")

	if idStr == "" {
		http.Error(w, "The ID is required!",
			http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "The ID must be a number!",
			http.StatusBadRequest)
		return
	}

	var command Command

	err = command.Delete(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func UpdateCommands(w http.ResponseWriter, r *http.Request) {
	var command Command

	err := json.NewDecoder(r.Body).Decode(&command)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = command.Update()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}
