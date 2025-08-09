package routehandlers

import (
	"math"
	"net/http"
	core "wealthmanagerassignment/Core"
	"wealthmanagerassignment/data"
)

type SummaryResponse struct {
	TotalValue           float64       `json:"totalValue"`
	TotalInvested        float64       `json:"totalInvested"`
	TotalGainLoss        float64       `json:"totalGainLoss"`
	TotalGainLossPercent float64       `json:"totalGainLossPercent"`
	TopPerformer         *data.Holding `json:"topPerformer,omitempty"`
	WorstPerformer       *data.Holding `json:"worstPerformer,omitempty"`
	DiversificationScore float64       `json:"diversificationScore"`
	RiskLevel            string        `json:"riskLevel"`
}

func SummaryHandler(w http.ResponseWriter, r *http.Request, hs []data.Holding) {
	totalValue := 0.0
	totalInvested := 0.0
	var top *data.Holding
	var worst *data.Holding
	for i := range hs {
		h := &hs[i]
		totalValue += h.Value
		totalInvested += h.Quantity * h.AvgPrice
		if top == nil || h.GainLossPercent > top.GainLossPercent {
			top = h
		}
		if worst == nil || h.GainLossPercent < worst.GainLossPercent {
			worst = h
		}
	}
	totalGain := core.RoundTwo(totalValue - totalInvested)
	totalGainPct := 0.0
	if totalInvested != 0 {
		totalGainPct = core.RoundTwo((totalGain / totalInvested) * 100)
	}
	// diversificationScore: naive metric = number of sectors scaled (lower is less diversified)
	sectorSet := map[string]struct{}{}
	for _, h := range hs {
		if h.Sector != "" {
			sectorSet[h.Sector] = struct{}{}
		}
	}
	sectorCount := len(sectorSet)
	divScore := 0.0
	if sectorCount > 0 {
		// score between 0-10: more sectors -> higher score
		divScore = core.RoundTwo(math.Min(10, float64(sectorCount)*2.5))
	}

	risk := "Moderate"
	if totalGainPct > 20 {
		risk = "High"
	} else if totalGainPct < 0 {
		risk = "Low"
	}

	resp := SummaryResponse{
		TotalValue:           core.RoundTwo(totalValue),
		TotalInvested:        core.RoundTwo(totalInvested),
		TotalGainLoss:        totalGain,
		TotalGainLossPercent: totalGainPct,
		DiversificationScore: divScore,
		RiskLevel:            risk,
	}
	if top != nil {
		resp.TopPerformer = top
	}
	if worst != nil {
		resp.WorstPerformer = worst
	}
	core.WriteJSON(w, http.StatusOK, resp)
}
