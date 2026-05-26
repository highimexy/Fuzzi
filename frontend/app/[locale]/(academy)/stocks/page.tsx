import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'
import { OperationsDashboard } from '../_components/OperationsDashboard'

export default function StocksPage() {
  return (
    <div className="align-center flex h-full w-full items-center justify-center">
      <AcademyBackgroundGrid />
      <div className="">
        <OperationsDashboard />
      </div>
    </div>
  )
}
