package routehandlers

import (
	"net/http"
	core "wealthmanagerassignment/Core"
	"wealthmanagerassignment/data"
)

type AllocationBucket struct {
	Value      float64 `json:"value"`
	Percentage float64 `json:"percentage"`
}

type AllocationResponse struct {
	BySector    map[string]AllocationBucket `json:"bySector"`
	ByMarketCap map[string]AllocationBucket `json:"byMarketCap"`
}

func AllocationHandler(w http.ResponseWriter, r *http.Request, hs []data.Holding) {
	total := 0.0
	bySector := map[string]float64{}
	byMarket := map[string]float64{}
	for _, h := range hs {
		total += h.Value
		sector := h.Sector
		if sector == "" {
			sector = "Unknown"
		}
		bySector[sector] += h.Value

		mc := h.MarketCap
		if mc == "" {
			mc = "Unknown"
		}
		byMarket[mc] += h.Value
	}
	resp := AllocationResponse{
		BySector:    map[string]AllocationBucket{},
		ByMarketCap: map[string]AllocationBucket{},
	}
	for k, v := range bySector {
		p := 0.0
		if total != 0 {
			p = (v / total) * 100
		}
		resp.BySector[k] = AllocationBucket{Value: core.RoundTwo(v), Percentage: core.RoundTwo(p)}
	}
	for k, v := range byMarket {
		p := 0.0
		if total != 0 {
			p = (v / total) * 100
		}
		resp.ByMarketCap[k] = AllocationBucket{Value: core.RoundTwo(v), Percentage: core.RoundTwo(p)}
	}

	core.WriteJSON(w, http.StatusOK, resp)
}
