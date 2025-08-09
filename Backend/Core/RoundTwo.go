package core

import "math"

func RoundTwo(v float64) float64 {
	return math.Round(v*100) / 100
}
