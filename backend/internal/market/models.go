package market

type Asset struct {
	Sym   string `json:"sym"`
	Price string `json:"price"`
	Chg   string `json:"chg"`
	Up    bool   `json:"up"`
}

type MarketRow struct {
	Category string  `json:"category"`
	Items    []Asset `json:"items"`
	Status   string  `json:"status,omitempty"`
}
