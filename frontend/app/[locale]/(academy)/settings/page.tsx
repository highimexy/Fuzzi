'use client'

import { FiSettings, FiMail, FiShield, FiBell } from 'react-icons/fi'
import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'

export default function SettingsPage() {
  return (
    <div className="relative flex h-full items-center overflow-hidden py-10">
      <AcademyBackgroundGrid />

      <div className="relative mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* PROFILE SETTINGS */}
          <section className="border-foreground/10 bg-background border p-8">
            <h2 className="border-foreground/5 mb-6 flex items-center gap-2 border-b pb-4 font-serif text-xl font-bold uppercase">
              <FiMail className="text-foreground/50" /> Account Identity
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="text-foreground/60 mb-2 block font-sans text-[10px] font-bold tracking-widest uppercase">
                  Display Name
                </label>
                <input
                  type="text"
                  defaultValue="Nick Name"
                  className="border-foreground/20 focus:border-foreground/50 w-full border bg-transparent p-3 font-sans outline-none"
                />
              </div>
              <div>
                <label className="text-foreground/60 mb-2 block font-sans text-[10px] font-bold tracking-widest uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="user@example.com"
                  disabled
                  className="border-foreground/10 bg-foreground/5 text-foreground/50 w-full border p-3 font-sans outline-none"
                />
                <p className="text-foreground/40 mt-2 text-xs">
                  Email cannot be changed directly. Contact HQ.
                </p>
              </div>
            </div>
            <button className="border-foreground/20 hover:bg-foreground/5 mt-6 border px-6 py-2 font-sans text-sm uppercase transition-colors">
              Update Identity
            </button>
          </section>

          {/* NOTIFICATIONS */}
          <section className="border-foreground/10 bg-background border p-8">
            <h2 className="border-foreground/5 mb-6 flex items-center gap-2 border-b pb-4 font-serif text-xl font-bold uppercase">
              <FiBell className="text-foreground/50" /> Comms & Alerts
            </h2>
            <div className="space-y-4">
              <label className="border-foreground/5 hover:bg-foreground/5 flex cursor-pointer items-center justify-between border p-4">
                <div>
                  <p className="font-serif text-lg font-bold uppercase">Weekly Debrief</p>
                  <p className="text-foreground/50 font-sans text-xs">
                    Receive a summary of your activity and new lessons.
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5 accent-yellow-500" />
              </label>
              <label className="border-foreground/5 hover:bg-foreground/5 flex cursor-pointer items-center justify-between border p-4">
                <div>
                  <p className="font-serif text-lg font-bold uppercase">Mentions & Replies</p>
                  <p className="text-foreground/50 font-sans text-xs">
                    Get notified when someone replies to you in Discuss.
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5 accent-yellow-500" />
              </label>
            </div>
          </section>

          {/* DANGER ZONE */}
          <section className="border border-red-500/20 bg-red-500/5 p-8">
            <h2 className="mb-6 flex items-center gap-2 border-b border-red-500/20 pb-4 font-serif text-xl font-bold text-red-500 uppercase">
              <FiShield /> Danger Zone
            </h2>
            <p className="text-foreground/70 mb-4 font-sans text-sm">
              Permanently erase your data and revoke your access to the Frontier. This action cannot
              be undone.
            </p>
            <button className="border border-red-500 bg-red-500/10 px-6 py-2 font-sans text-sm font-bold text-red-500 uppercase transition-colors hover:bg-red-500 hover:text-white">
              Deactivate Account
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
