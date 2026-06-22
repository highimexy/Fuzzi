import { ReactNode } from 'react'
import { AcademyNavbar } from './_components/AcademyNavbar'
import { AcademySidebar } from './_components/AcademySidebar'
import { AcademyFooter } from './_components/AcademyFooter'
export default function AcademyLayout({ children }: { children: ReactNode }) {
  return (
    // Usunięte 'bg-background' by nie blokowało widoczności 3D w tle
    <div className="flex w-full flex-1 flex-col overflow-hidden bg-transparent">
      <AcademyNavbar />

      <div className="relative z-60 flex flex-1">
        <AcademySidebar />

        {/* Usunięte overflow-y-auto stąd - Wrapper decyduje o scrollu */}
        <div className="relative flex flex-1 flex-col overflow-hidden">
          {/* Main musi mieć h-full, żeby wypełnić miejsce pod 3D */}
          <main className="relative flex h-full flex-1 flex-col">{children}</main>

          <div className="mt-auto">
            <AcademyFooter />
          </div>
        </div>
      </div>
    </div>
  )
}
