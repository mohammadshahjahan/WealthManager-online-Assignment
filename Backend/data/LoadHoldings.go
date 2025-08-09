package data

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	core "wealthmanagerassignment/Core"

	"github.com/xuri/excelize/v2"
)

type Holding struct {
	Symbol          string  `json:"symbol"`
	Name            string  `json:"name"`
	Quantity        float64 `json:"quantity"`
	AvgPrice        float64 `json:"avgPrice"`
	CurrentPrice    float64 `json:"currentPrice"`
	Sector          string  `json:"sector"`
	MarketCap       string  `json:"marketCap"`
	Exchange        string  `json:"exchange,omitempty"`
	Value           float64 `json:"value"`
	GainLoss        float64 `json:"gainLoss"`
	GainLossPercent float64 `json:"gainLossPercent"`
}

func LoadHoldings() ([]Holding, error) {
	path := os.Getenv("DATA_FILE")
	if path == "" {
		path = "data/portfolio.xlsx"
	}

	f, err := excelize.OpenFile(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	// Get first sheet
	sheet := f.GetSheetName(0)
	if sheet == "" {
		return nil, fmt.Errorf("no sheets found in excel")
	}

	rows, err := f.GetRows(sheet)
	if err != nil {
		return nil, err
	}
	if len(rows) < 2 {
		return nil, fmt.Errorf("excel has no data rows")
	}

	// Map header -> index
	header := rows[0]
	colIndex := map[string]int{}
	for i, h := range header {
		normalized := strings.TrimSpace(strings.ToLower(h))
		colIndex[normalized] = i
	}

	// helper to find column by a list of possible names
	find := func(candidates ...string) (int, bool) {
		for _, cand := range candidates {
			if idx, ok := colIndex[strings.ToLower(cand)]; ok {
				return idx, true
			}
		}
		return -1, false
	}

	// Common header names from user:
	// Symbol, Company Name, Quantity, Avg Price ₹, Current Price (₹), Sector, Market Cap, Exchange, Value ₹, Gain/Loss (₹), Gain/Loss %

	// Resolve columns
	symbolIdx, _ := find("symbol")
	nameIdx, _ := find("company name", "name")
	quantityIdx, _ := find("quantity")
	avgIdx, _ := find("avg price ₹", "avg price", "avgprice")
	currentIdx, _ := find("current price (₹)", "current price", "currentprice")
	sectorIdx, _ := find("sector")
	marketCapIdx, _ := find("market cap", "marketcap")
	exchangeIdx, _ := find("exchange")
	// value/gain columns may be provided but we will recompute them regardless
	// iterate rows
	holdings := []Holding{}
	for i := 1; i < len(rows); i++ {
		row := rows[i]
		// skip empty rows
		if len(row) == 0 {
			continue
		}
		get := func(idx int) string {
			if idx >= 0 && idx < len(row) {
				return strings.TrimSpace(row[idx])
			}
			return ""
		}
		h := Holding{}
		if symbolIdx >= 0 {
			h.Symbol = get(symbolIdx)
		}
		if nameIdx >= 0 {
			h.Name = get(nameIdx)
		}
		if exchangeIdx >= 0 {
			h.Exchange = get(exchangeIdx)
		}
		if sectorIdx >= 0 {
			h.Sector = get(sectorIdx)
		}
		if marketCapIdx >= 0 {
			h.MarketCap = get(marketCapIdx)
		}

		// parse numeric fields safely (digit by digit style-ish)
		parseFloat := func(s string) float64 {
			// strip common non-digit characters like ₹, commas, % etc
			clean := strings.ReplaceAll(s, "₹", "")
			clean = strings.ReplaceAll(clean, ",", "")
			clean = strings.ReplaceAll(clean, "%", "")
			clean = strings.TrimSpace(clean)
			if clean == "" {
				return 0
			}
			val, err := strconv.ParseFloat(clean, 64)
			if err != nil {
				return 0
			}
			return val
		}

		if quantityIdx >= 0 {
			h.Quantity = parseFloat(get(quantityIdx))
		}
		if avgIdx >= 0 {
			h.AvgPrice = parseFloat(get(avgIdx))
		}
		if currentIdx >= 0 {
			h.CurrentPrice = parseFloat(get(currentIdx))
		}

		// calculations
		h.Value = core.RoundTwo(h.Quantity * h.CurrentPrice)
		h.GainLoss = core.RoundTwo((h.CurrentPrice - h.AvgPrice) * h.Quantity)
		invested := h.Quantity * h.AvgPrice
		if invested != 0 {
			h.GainLossPercent = core.RoundTwo((h.GainLoss / invested) * 100)
		} else {
			h.GainLossPercent = 0
		}
		// if symbol blank and name blank, skip
		if h.Symbol == "" && h.Name == "" {
			continue
		}
		holdings = append(holdings, h)
	}

	return holdings, nil
}
