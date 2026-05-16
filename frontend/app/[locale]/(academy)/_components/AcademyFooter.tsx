import Link from 'next/link'
import { FiSmartphone } from 'react-icons/fi'

export function AcademyFooter() {
  return (
    <footer className="border-foreground/10 flex flex-col items-center gap-3 border-t p-4 font-sans opacity-50 sm:flex-row sm:justify-between">
      <div className="text-sm">Copyright © {new Date().getFullYear()} Fuzzi.</div>
      <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 sm:justify-end">
        <div className="border-foreground/20 border-r">
          <Link href="/help" className="flex items-center gap-1 pr-2 hover:underline">
            <FiSmartphone className="text-md" />
            Download App
          </Link>
        </div>
        <div className="border-foreground/20 border-r">
          <Link href="/help" className="pr-2 hover:underline">
            Help Center
          </Link>
        </div>
        <div className="border-foreground/20 border-r">
          <Link href="/terms" className="pr-2 hover:underline">
            Terms
          </Link>
        </div>
        <Link href="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
      </div>
    </footer>
  )
}
