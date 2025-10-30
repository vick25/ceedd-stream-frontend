"use client"
import { Nav } from '@/components/Nav'
import { WellForm } from '@/components/WellForm'
import { useWellsStore } from '@/store/wells'
import { useRouter } from 'next/navigation'

export default function NewWellPage() {
  const add = useWellsStore(s => s.addOrUpdate)
  const router = useRouter()
  return (
    <div>
      <Nav />
      <main className="container py-6 space-y-6">
        <h1 className="text-xl font-semibold">Nouveau puits</h1>
        <WellForm onSubmit={(w)=>{ add(w); router.push('/wells') }} />
      </main>
    </div>
  )
}


