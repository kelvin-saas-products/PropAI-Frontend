import AiBriefing from '@/components/dashboard/AiBriefing'
import StatCards from '@/components/dashboard/StatCards'
import SavedProperties from '@/components/dashboard/SavedProperties'
import MyProperties from '@/components/dashboard/MyProperties'
import PropertyNews from '@/components/dashboard/PropertyNews'
import UpcomingInspections from '@/components/dashboard/UpcomingInspections'

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-[1280px] mx-auto">
      <AiBriefing />
      <StatCards />

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <SavedProperties />
        <MyProperties />
      </div>

      <PropertyNews />
      <UpcomingInspections />
    </div>
  )
}
