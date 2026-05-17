'use client'

import {
  FiEdit2,
  FiMapPin,
  FiLink,
  FiTwitter,
  FiLinkedin,
  FiGithub,
  FiUser,
  FiLock,
} from 'react-icons/fi'
import { ActivityCalendar, ThemeInput } from 'react-activity-calendar'
import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'

const generateMockData = () => {
  const data = []
  const today = new Date()
  for (let i = 365; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const count = Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0
    const level = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 8 ? 3 : 4

    data.push({
      date: date.toISOString().split('T')[0] ?? '',
      count,
      level,
    })
  }
  return data
}

const activityData = generateMockData()

const calendarTheme: ThemeInput = {
  light: ['#1f1f1f', '#89937e', '#89937e', '#576966', '#fde047'],
  dark: [
    'rgba(255,255,255,0.05)',
    'rgba(253, 224, 71, 0.3)',
    'rgba(253, 224, 71, 0.6)',
    'rgba(253, 224, 71, 0.8)',
    '#fde047',
  ],
}

export default function ProfilePage() {
  return (
    <div className="relative flex h-full items-center overflow-hidden py-10">
      <AcademyBackgroundGrid />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* TOP INFO BAR */}
        <div className="mb-6 flex justify-end">
          <p className="text-foreground/40 flex items-center gap-2 font-sans text-xs tracking-widest uppercase">
            <span className="text-sm">
              <FiLock />
            </span>{' '}
            Your profile is private until you reach level 10
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* LEWA KOLUMNA: AVATAR & BIO */}
          <div className="space-y-4 md:col-span-3">
            <div className="border-foreground/10 bg-background flex flex-col items-center border p-6 text-center">
              <div className="group relative">
                <button className="mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-accent/50">
                  {' '}
                  <FiUser className="text-6xl" />
                </button>
              </div>
              <h2 className="font-serif text-2xl font-bold tracking-tighter uppercase">
                Nick Name
              </h2>
              <p className="text-foreground/60 mb-4 font-sans text-sm">@id</p>

              <div className="border-foreground/5 w-full border-t pt-4 text-left">
                <div className="flex items-center justify-center gap-2">
                  <span className="font-serif text-lg font-bold uppercase">Level 1</span>
                  <span className="font-sans text-sm font-bold text-primary uppercase">
                    280 XP
                  </span>
                </div>
              </div>
            </div>

            <div className="border-foreground/10 bg-background h-29 border p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-serif text-xs font-bold tracking-widest uppercase">About me</h3>
                <FiEdit2 className="text-foreground/40 cursor-pointer text-lg" />
              </div>
              <p className="text-foreground/70 font-sans text-sm italic">
                A little something about me...
              </p>
            </div>
          </div>

          {/* ŚRODKOWA KOLUMNA: SOCIALS & STATS */}
          <div className="space-y-4 md:col-span-9">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* SOCIAL LINKS */}
              <div className="border-foreground/10 bg-background space-y-4 border p-6">
                {[
                  { icon: <FiMapPin />, text: 'Poland' },
                  { icon: <FiLink />, text: 'Personal site' },
                  { icon: <FiTwitter />, text: 'Twitter handle' },
                  { icon: <FiLinkedin />, text: 'LinkedIn URL' },
                  { icon: <FiGithub />, text: 'GitHub handle' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="text-foreground flex items-center gap-3 transition-colors">
                      <span className="text-sm">{item.icon}</span>
                      <span className="font-sans text-sm">{item.text}</span>
                    </div>
                    <FiEdit2 className="text-foreground/20 text-md hover:text-foreground/50 cursor-pointer" />
                  </div>
                ))}
              </div>

              {/* STATS 1 */}
              <div className="border-foreground/10 bg-background flex flex-col justify-center border p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-foreground/40 font-sans text-[10px] leading-none font-bold tracking-widest uppercase">
                        Lessons solved
                      </p>
                      <p className="font-serif text-2xl font-bold">1</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-foreground/40 font-sans text-[10px] font-bold tracking-widest uppercase">
                      Leaderboard rank
                    </p>
                    <p className="font-serif text-lg font-bold">#811,169</p>
                  </div>
                  <div>
                    <p className="text-foreground/40 font-sans text-[10px] font-bold tracking-widest uppercase">
                      Joined
                    </p>
                    <p className="font-serif text-lg font-bold">May 11, 2026</p>
                  </div>
                </div>
              </div>

              {/* STATS 2 - KARMA */}
              <div className="border-foreground/10 bg-background flex flex-col justify-center border p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-foreground/40 font-sans text-[10px] leading-none font-bold tracking-widest uppercase">
                        Karma
                      </p>
                      <p className="font-serif text-2xl font-bold">0</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-foreground/40 font-sans text-[10px] font-bold tracking-widest uppercase">
                      Upvotes
                    </p>
                    <p className="font-serif text-lg font-bold">4</p>
                  </div>
                  <div>
                    <p className="text-foreground/40 font-sans text-[10px] font-bold tracking-widest uppercase">
                      Thanks received
                    </p>
                    <p className="font-serif text-lg font-bold">11</p>
                  </div>
                </div>
              </div>
            </div>

            {/* HEATMAP / CALENDAR */}
            <div className="border-foreground/10 bg-background border p-8">
              <div className="custom-scrollbar flex w-full justify-center overflow-x-auto">
                <ActivityCalendar
                  data={activityData}
                  theme={calendarTheme}
                  colorScheme="dark"
                  blockSize={11}
                  blockRadius={2}
                  blockMargin={4}
                  fontSize={10}
                  labels={{
                    legend: {
                      less: 'Less',
                      more: 'More',
                    },
                    months: [
                      'Jan',
                      'Feb',
                      'Mar',
                      'Apr',
                      'May',
                      'Jun',
                      'Jul',
                      'Aug',
                      'Sep',
                      'Oct',
                      'Nov',
                      'Dec',
                    ],
                    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
