package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	routes "wealthmanagerassignment/Routes"

	"github.com/gorilla/handlers"
)

func main() {

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	corsOptions := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)

	router := routes.Routes()
	fmt.Printf("Listening on :%s\n", port)

	log.Fatal(http.ListenAndServe(":"+port, corsOptions(router)))
}
