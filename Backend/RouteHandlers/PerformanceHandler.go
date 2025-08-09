package routehandlers

import (
	"net/http"
	core "wealthmanagerassignment/Core"
	"wealthmanagerassignment/data"
)

type TimelinePoint struct {
	Date      string  `json:"date"`
	Portfolio float64 `json:"portfolio"`
	Nifty50   float64 `json:"nifty50"`
	Gold      float64 `json:"gold"`
}

type PerformanceResponse struct {
	Timeline []TimelinePoint               `json:"timeline"`
	Returns  map[string]map[string]float64 `json:"returns"`
}

func PerformanceHandler(w http.ResponseWriter, r *http.Request, hs []data.Holding) {
	// Since the provided excel contains current holdings only, we generate a simple 3-point timeline:
	// - 3 months ago: portfolio value = currentValue * (1 - avgChange)
	// - 1 month ago: currentValue * (1 - avgChange/2)
	// - today: currentValue
	//
	// avgChange is computed as average gain% across holdings (if none, assume 5% over 6 months).

	totalNow := 0.0
	avgGainPct := 0.0
	if len(hs) == 0 {
		totalNow = 0
		avgGainPct = 5.0
	} else {
		for _, h := range hs {
			totalNow += h.Value
			avgGainPct += h.GainLossPercent
		}
		avgGainPct = avgGainPct / float64(len(hs))
	}

	// Translate avgGainPct into simplistic historical points
	// We'll create three timeline points with simple math (NOT market-accurate).
	point1 := TimelinePoint{
		Date:      "2024-01-01",
		Portfolio: core.RoundTwo(totalNow * (1 - avgGainPct/100*0.7)),
		Nifty50:   core.RoundTwo(21000 * (1 - 0.03)),
		Gold:      core.RoundTwo(62000 * (1 - 0.01)),
	}
	point2 := TimelinePoint{
		Date:      "2024-03-01",
		Portfolio: core.RoundTwo(totalNow * (1 - avgGainPct/100*0.3)),
		Nifty50:   core.RoundTwo(22100 * (1 + 0.02)),
		Gold:      core.RoundTwo(64500 * (1 + 0.01)),
	}
	point3 := TimelinePoint{
		Date:      "2024-06-01",
		Portfolio: core.RoundTwo(totalNow),
		Nifty50:   core.RoundTwo(23500 * (1 + 0.03)),
		Gold:      core.RoundTwo(68000 * (1 + 0.02)),
	}

	returnResp := map[string]map[string]float64{
		"portfolio": {
			"1month":  core.RoundTwo(avgGainPct / 6), // crude
			"3months": core.RoundTwo(avgGainPct / 2), // crude
			"1year":   core.RoundTwo(avgGainPct * 2), // crude scaling
		},
		"nifty50": {
			"1month":  1.8,
			"3months": 6.2,
			"1year":   12.4,
		},
		"gold": {
			"1month":  -0.5,
			"3months": 4.1,
			"1year":   8.9,
		},
	}
	perf := PerformanceResponse{
		Timeline: []TimelinePoint{point1, point2, point3},
		Returns:  returnResp,
	}
	core.WriteJSON(w, http.StatusOK, perf)
}
