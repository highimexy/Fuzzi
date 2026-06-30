'use client'

import { Link } from 'next-view-transitions'
import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'

export default function TermsPage() {
  return (
    <div className="flex w-full flex-1 items-stretch justify-center font-sans">
      {/* LEWA SIATKA */}
      <div className="border-foreground/10 relative hidden flex-1 border-r lg:block">
        <AcademyBackgroundGrid />
      </div>

      {/* ŚRODKOWY KONTENT - SZEROKI */}
      <div className="flex w-full max-w-4xl flex-col px-6 py-16 md:px-12 xl:max-w-5xl">
        <h1 className="mb-8 font-serif text-4xl font-bold md:text-5xl">Terms of Service</h1>
        <p className="text-foreground/60 mb-12 font-sans text-sm">Last updated: May 2026</p>

        <div className="text-foreground/80 space-y-8 font-sans leading-relaxed">
          <section>
            <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">1. Introduction</h2>
            <p>
              Welcome to Frontier. By accessing or using our platform, learning paths, and QA
              compendiums, you agree to be bound by these Terms of Service. If you do not agree,
              please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">
              2. Subscriptions and Payments
            </h2>
            <p className="mb-4">
              Frontier offers Premium subscriptions billed on a monthly or yearly basis. By
              selecting a premium plan, you authorize us to charge your provided payment method.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Subscriptions automatically renew unless canceled before the next billing cycle.
              </li>
              <li>You may cancel your subscription at any time through your account settings.</li>
              <li>All payments are non-refundable unless required by applicable law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">
              3. Intellectual Property
            </h2>
            <p>
              All content on Frontier, including but not limited to text, code snippets, diagrams,
              lessons, and UI components, is the intellectual property of Frontier. You may not
              reproduce, distribute, or create derivative works without explicit permission.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">4. User Conduct</h2>
            <p>
              You agree to use our platform only for lawful purposes. You are strictly prohibited
              from sharing your account credentials, attempting to scrape our content, or attempting
              to compromise the security of our infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">
              5. Disclaimer of Warranties
            </h2>
            <p>
              Our courses and "Reality Check" materials are provided "as is". While we strive for
              accuracy, we do not guarantee that completing our courses will result in employment,
              promotion, or specific financial outcomes.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">6. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@frontier.dev" className="text-accent hover:underline">
                legal@frontier.dev
              </a>
              .
            </p>
          </section>
        </div>

        <div className="border-foreground/10 mt-16 border-t pt-8">
          <Link
            href="/"
            className="text-foreground/50 hover:text-foreground font-sans text-sm font-bold tracking-widest uppercase transition-colors"
          >
            &larr; Back to Home
          </Link>
        </div>
      </div>

      {/* PRAWA SIATKA */}
      <div className="border-foreground/10 relative hidden flex-1 border-l lg:block">
        <AcademyBackgroundGrid />
      </div>
    </div>
  )
}
