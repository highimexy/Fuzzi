'use client'

import { FiTerminal, FiExternalLink } from 'react-icons/fi'
import { useState, useEffect } from 'react'

interface Asset {
  sym: string
  price: string
  chg: string
  up: boolean
}

interface MarketRow {
  category: string
  items: Asset[]
  status?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
const WS_URL = API_URL.replace('http', 'ws')

function yahooUrl(sym: string, isCrypto: boolean): string {
  return isCrypto
    ? `https://finance.yahoo.com/quote/${sym}-USD`
    : `https://finance.yahoo.com/quote/${sym}`
}

export function OperationsDashboard() {
  const [markets, setMarkets] = useState<MarketRow[]>([])
  const [wsStatus, setWsStatus] = useState<'CONNECTING' | 'CONNECTED' | 'DISCONNECTED'>(
    'CONNECTING'
  )

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}/ws/market`)

    ws.onopen = () => {
      setWsStatus('CONNECTED')
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setMarkets(data)
    }

    ws.onclose = () => {
      setWsStatus('DISCONNECTED')
    }

    return () => {
      ws.close()
    }
  }, [])

  return (
    <div className="border-foreground/20 bg-background w-full overflow-hidden border shadow-2xl backdrop-blur-md">
          <div className="border-foreground/10 bg-foreground/5 flex h-10 w-full items-center justify-between border-b px-4">
            <div className="flex items-center gap-2">
              <div className="border-error/30 bg-error/80 h-3 w-3 rounded-full border" />
              <div className="border-accent/30 bg-accent/80 h-3 w-3 rounded-full border" />
              <div className="border-primary/30 bg-primary/80 h-3 w-3 rounded-full border" />
              <div className="text-foreground ml-2 flex translate-y-0.5 items-center gap-2 font-sans text-[10px] leading-none opacity-50">
                <FiTerminal className="text-xs" />
                <span>market_board.zsh</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${wsStatus === 'CONNECTED' ? 'bg-primary animate-pulse' : 'bg-error'}`}
              />
              <span className="text-foreground translate-y-px font-sans text-[8px] opacity-40">
                {wsStatus}
              </span>
            </div>
          </div>

          <div className="p-6 font-sans text-sm">
            <div className="mb-6 flex flex-col gap-1 text-xs opacity-60">
              <span>[!] Initializing secure WebSocket stream... OK.</span>
              <span>[!] Fetching {markets.length || 4} data streams... OK.</span>
              <span className="border-foreground/10 text-foreground mt-2 border-b pb-2 font-bold tracking-widest uppercase">
                Terminal Active
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {markets.map((row) => {
                const isCrypto = row.category === 'CRYPTO'
                return (
                  <div
                    key={row.category}
                    className="border-foreground/10 hover:border-foreground/30 flex flex-col gap-3 border-l-2 pl-4 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-foreground text-[10px] font-bold tracking-widest uppercase opacity-40">
                        [{row.category}]
                      </span>
                      {row.status && (
                        <span className="text-accent/70 text-[9px] font-bold tracking-widest uppercase">
                          {row.status}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {row.items.map((item) => (
                        <a
                          key={item.sym}
                          href={yahooUrl(item.sym, isCrypto)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex justify-between gap-2 text-xs transition-opacity hover:opacity-100 opacity-90"
                        >
                          <span className="text-foreground flex items-center gap-1 font-bold opacity-80 group-hover:opacity-100">
                            {item.sym}
                            <FiExternalLink className="text-[9px] opacity-0 transition-opacity group-hover:opacity-40" />
                          </span>
                          <div className="flex gap-2 text-right">
                            <span className="text-foreground w-16 text-right opacity-60">
                              {item.price}
                            </span>
                            <span
                              className={`w-14 animate-pulse text-right ${item.up ? 'text-primary' : 'text-error'}`}
                            >
                              {item.chg}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )
              })}

              {markets.length === 0 && wsStatus === 'CONNECTING' && (
                <div className="col-span-full text-xs opacity-40">
                  Awaiting market data payload...
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs opacity-50">
              <span>guest@tfj:~$</span>
              <span className="bg-foreground h-4 w-2 animate-pulse"></span>
            </div>
      </div>
    </div>
  )
}
