package market

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func NewHandler(hub *Hub, engine *Engine) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ws, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("[MARKET WS ERROR]", err)
			return
		}

		hub.AddClient(ws)
		log.Println("[MARKET] Terminal connected.")

		// Send initial state immediately upon connection
		ws.WriteJSON(engine.GetData())

		// Keep connection alive, wait for client to disconnect
		for {
			if _, _, err := ws.ReadMessage(); err != nil {
				break
			}
		}

		hub.RemoveClient(ws)
		log.Println("[MARKET] Terminal disconnected.")
	}
}
