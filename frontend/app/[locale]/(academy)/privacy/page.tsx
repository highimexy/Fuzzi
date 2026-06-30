'use client'

import { Link } from 'next-view-transitions'
import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'

export default function PrivacyPage() {
  return (
    <div className="flex w-full flex-1 items-stretch justify-center font-sans">
      {/* LEWA SIATKA */}
      <div className="border-foreground/10 relative hidden flex-1 border-r lg:block">
        <AcademyBackgroundGrid />
      </div>

      {/* ŚRODKOWY KONTENT - SZEROKI */}
      <div className="flex w-full max-w-4xl flex-col px-6 py-16 md:px-12 xl:max-w-5xl">
        <h1 className="mb-8 font-serif text-4xl font-bold md:text-5xl">Privacy Policy</h1>
        <p className="text-foreground/60 mb-12 font-sans text-sm">Last updated: May 2026</p>

        <div className="text-foreground/80 space-y-8 font-sans leading-relaxed">
          <section>
            <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">
              1. Information We Collect
            </h2>
            <p className="mb-4">
              We only collect information necessary to provide and improve the Frontier learning
              experience:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Account Data:</strong> Email address, username, and password (securely
                hashed).
              </li>
              <li>
                <strong>Payment Data:</strong> Processed securely by our third-party payment
                providers (e.g., Stripe). We do not store full credit card numbers on our servers.
              </li>
              <li>
                <strong>Usage Data:</strong> Lesson progress, quiz scores, and interaction with our
                UI to help us improve the platform.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">
              2. How We Use Your Information
            </h2>
            <p className="mb-4">Your data is used strictly for the following purposes:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>To provide, maintain, and personalize your learning dashboard.</li>
              <li>To process premium subscription transactions and send invoices.</li>
              <li>
                To communicate with you regarding platform updates, security alerts, and support
                messages.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">
              3. Cookies and Tracking
            </h2>
            <p>
              We use essential cookies to keep you logged in and remember your preferences. We may
              also use minimal analytics cookies to understand how our community interacts with the
              curriculum. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">
              4. Third-Party Services
            </h2>
            <p>
              We do not sell your personal data to anyone. We only share data with trusted third
              parties necessary to operate our business, such as payment processors, cloud hosting
              providers, and email delivery services, all of which are bound by strict
              confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">
              5. Your Data Rights (GDPR)
            </h2>
            <p>
              If you are a resident of the European Economic Area (EEA), you have the right to
              access, correct, export, or delete your personal data. You can exercise these rights
              directly from your account settings or by contacting our support team.
            </p>
          </section>

          <section>
            <h2 className="text-foreground mb-4 font-serif text-2xl font-bold">6. Contact Us</h2>
            <p>
              For any privacy-related inquiries or data deletion requests, please email us at{' '}
              <a href="mailto:privacy@frontier.dev" className="text-secondary hover:underline">
                privacy@frontier.dev
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
