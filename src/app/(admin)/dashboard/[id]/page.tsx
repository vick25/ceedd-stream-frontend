"use client"
import { Nav } from '@/components/Nav'
import { WellForm } from '@/components/WellForm'
import { useWellsStore } from '@/store/wells'
import { useParams, useRouter } from 'next/navigation'

export default function EditWellPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const wells = useWellsStore(s => s.wells)
  const save = useWellsStore(s => s.addOrUpdate)
  const well = wells.find(w => w.id === params.id)
  return (
    <div>
      <Nav />
      <main className="container py-6 space-y-6">
        <h1 className="text-xl font-semibold">Modifier le puits</h1>
        {well ? (
          <WellForm initial={well} onSubmit={(w)=>{ save(w); router.push('/wells') }} />
        ) : (
          <div>Puits introuvable.</div>
        )}
      </main>
    </div>
  )
}


