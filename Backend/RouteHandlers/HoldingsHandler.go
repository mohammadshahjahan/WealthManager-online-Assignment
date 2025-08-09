package routehandlers

import (
	"net/http"
	core "wealthmanagerassignment/Core"
	"wealthmanagerassignment/data"
)

func HoldingsHandler(w http.ResponseWriter, r *http.Request, holdings []data.Holding) {
	core.WriteJSON(w, http.StatusOK, holdings)
}
