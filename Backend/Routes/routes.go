package routes

import (
	"net/http"
	routehandlers "wealthmanagerassignment/RouteHandlers"
	"wealthmanagerassignment/data"

	"github.com/gorilla/mux"
)

func Routes() *mux.Router {
	r := mux.NewRouter()
	holdings, _ := data.LoadHoldings()

	r.HandleFunc("/api/portfolio/holdings", func(w http.ResponseWriter, r *http.Request) {
		routehandlers.HoldingsHandler(w, r, holdings)
	}).Methods("GET")

	r.HandleFunc("/api/portfolio/allocation", func(w http.ResponseWriter, r *http.Request) {
		routehandlers.AllocationHandler(w, r, holdings)
	}).Methods("GET")

	r.HandleFunc("/api/portfolio/performance", func(w http.ResponseWriter, r *http.Request) {
		routehandlers.PerformanceHandler(w, r, holdings)
	}).Methods("GET")

	r.HandleFunc("/api/portfolio/summary", func(w http.ResponseWriter, r *http.Request) {
		routehandlers.SummaryHandler(w, r, holdings)
	}).Methods("GET")

	return r
}
