'use client'

import { Container } from '../../wrappers/Container'
import { FiTerminal } from 'react-icons/fi'
import { useState, useEffect } from 'react'

interface Tweet {
  id: string
  author: string
  name: string
  time: string
  text: string
  avatar: string
}

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

export function OperationsDashboard() {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [markets, setMarkets] = useState<MarketRow[]>([])
  const [wsStatus, setWsStatus] = useState<'CONNECTING' | 'CONNECTED' | 'DISCONNECTED'>(
    'CONNECTING'
  )

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/v1/tweets?t=${Date.now()}`)
        if (!res.ok) throw new Error('Server connection error')

        const data = await res.json()
        setTweets(data)
      } catch (error) {
        console.error('[API Error]:', error)
      } finally {
        setIsLoading(false)
      }
    }

    setTimeout(() => fetchTweets(), 700)

    // Polling co 10 sekund dla rotacji tweetów
    const intervalId = setInterval(fetchTweets, 10000)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/ws/market')

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
    <section className="relative overflow-hidden">
      <Container className="relative z-10 py-20 lg:py-32">
        {/* SIDE WATERMARKS */}
        <div className="pointer-events-none absolute top-1/2 left-1 -z-10 hidden -translate-y-1/2 select-none lg:block">
          <div className="origin-center -rotate-90 pb-80 font-serif text-[clamp(4rem,18vw,11rem)] leading-none tracking-tighter uppercase opacity-[0.02]">
            Twitts
          </div>
        </div>

        <div className="pointer-events-none absolute top-1/2 right-0 -z-10 hidden -translate-y-1/2 select-none lg:block">
          <div className="origin-center rotate-90 pb-80 font-serif text-[clamp(4rem,18vw,12rem)] leading-none tracking-tighter uppercase opacity-[0.02]">
            Stocks
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-16 lg:flex-row lg:gap-24">
          {/* LEFT PANEL - PHONE */}
          <div className="border-foreground/20 bg-foreground/5 relative flex h-150 w-70 shrink-0 flex-col rounded-[3rem] border p-3 shadow-2xl backdrop-blur-md">
            <div className="border-background/20 bg-foreground absolute top-5 left-1/2 z-20 h-5 w-16 -translate-x-1/2 rounded-full border" />
            <div className="bg-foreground/20 absolute top-24 -left-1 h-12 w-1 rounded-l-md blur-[1px]" />
            <div className="bg-foreground/20 absolute top-32 -right-1 h-20 w-1 rounded-r-md blur-[1px]" />

            <div className="border-foreground/10 bg-background relative flex flex-1 flex-col overflow-hidden rounded-[2.5rem] border shadow-inner">
              <div className="border-foreground/10 bg-foreground/5 border-b p-4 pt-10 text-center">
                <span className="text-foreground font-mono text-[9px] font-bold tracking-widest uppercase opacity-50">
                  AI Pulse // Live Feed
                </span>
              </div>

              <div className="hide-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto p-4">
                {isLoading ? (
                  <div className="flex h-full w-full flex-col items-center justify-center text-center opacity-40">
                    <span className="border-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>
                    <span className="mt-4 animate-pulse font-mono text-[10px] tracking-widest uppercase">
                      [ Establishing Uplink... ]
                    </span>
                  </div>
                ) : tweets.length > 0 ? (
                  tweets.map((tweet) => (
                    <div
                      key={tweet.id}
                      className="border-foreground/10 flex flex-col gap-2 rounded-2xl border p-4 font-sans text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={tweet.avatar}
                            alt={tweet.name}
                            className="h-7 w-7 rounded-full object-cover opacity-80 grayscale"
                          />

                          <div className="flex flex-col">
                            <span className="text-foreground text-[10px] leading-tight font-bold">
                              {tweet.name}
                            </span>
                            <span className="text-foreground text-[9px] opacity-40">
                              {tweet.author}
                            </span>
                          </div>
                        </div>
                        <span className="text-foreground font-mono text-[9px] opacity-30">
                          {tweet.time}
                        </span>
                      </div>
                      <p className="text-foreground mt-1 text-xs leading-relaxed opacity-80">
                        {tweet.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-center opacity-30">
                    <span className="text-error font-mono text-[10px] tracking-widest uppercase">
                      [ Connection Failed ]
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - FINANCIAL TERMINAL */}
          <div className="flex w-full max-w-md shrink-0 flex-col items-center lg:max-w-lg">
            <div className="border-foreground/20 bg-background flex h-150 flex-col overflow-hidden rounded-xl border shadow-2xl backdrop-blur-md">
              <div className="border-foreground/10 bg-foreground/5 flex h-10 w-full items-center justify-between border-b px-4">
                <div className="flex items-center gap-2">
                  <div className="border-error/30 bg-error/80 h-3 w-3 rounded-full border" />
                  <div className="border-accent/30 bg-accent/80 h-3 w-3 rounded-full border" />
                  <div className="border-primary/30 bg-primary/80 h-3 w-3 rounded-full border" />
                  <div className="text-foreground ml-2 flex translate-y-0.5 items-center gap-2 font-mono text-[10px] leading-none opacity-50">
                    <FiTerminal className="text-xs" />
                    <span>market_board.zsh</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${wsStatus === 'CONNECTED' ? 'bg-primary animate-pulse' : 'bg-error'}`}
                  />
                  <span className="text-foreground translate-y-px font-mono text-[8px] opacity-40">
                    {wsStatus}
                  </span>
                </div>
              </div>

              <div className="flex flex-col p-6 font-mono text-sm leading-relaxed">
                <div className="mb-12 flex flex-col gap-1 text-xs opacity-60">
                  <span>[!] Initializing secure WebSocket stream... OK.</span>
                  <span>[!] Fetching {markets.length || 2} data streams... OK.</span>
                  <span className="border-foreground/10 text-foreground mt-2 border-b pb-2 font-bold tracking-widest uppercase">
                    Terminal Active
                  </span>
                </div>

                <div className="align-center flex flex-col gap-6">
                  {markets.map((row) => (
                    <div
                      key={row.category}
                      className="border-foreground/10 hover:border-foreground/30 flex flex-col gap-3 border-l-2 pl-4 transition-colors"
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="text-foreground text-[10px] font-bold tracking-widest uppercase opacity-40">
                          [{row.category}]
                        </span>
                        {row.status && (
                          <span className="text-accent/70 text-[9px] font-bold tracking-widest uppercase">
                            {row.status}
                          </span>
                        )}
                      </div>

                      <div className="grid w-full grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-8">
                        {row.items.map((item) => (
                          <div key={item.sym} className="flex justify-between gap-4 text-xs">
                            <span className="text-foreground font-bold opacity-80">{item.sym}</span>
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
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {markets.length === 0 && wsStatus === 'CONNECTING' && (
                    <div className="text-xs opacity-40">Awaiting market data payload...</div>
                  )}
                </div>

                <div className="mt-12 flex items-center gap-2 text-xs opacity-50">
                  <span>guest@tfj:~$</span>
                  <span className="bg-foreground h-4 w-2 animate-pulse"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
