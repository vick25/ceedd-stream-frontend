"use client"
import { Nav } from '@/components/Nav'
import { WellsMap } from '@/components/Map'
import { useWellsStore } from '@/store/wells'
import { useParams, useRouter } from 'next/navigation'

export default function WellDetailsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const wells = useWellsStore(s => s.wells)
  const remove = useWellsStore(s => s.remove)
  const well = wells.find(w => w.id === params.id)

  if (!well) {
    return (
      <div>
        <Nav />
        <main className="container py-6">
          Puits introuvable.
        </main>
      </div>
    )
  }

  return (
    <div>
      <Nav />
      <main className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{well.lastName} {well.firstName}</h1>
          <div className="flex gap-2">
            <button className="bg-red-600 text-white px-3 py-2 rounded" onClick={()=>{ if(confirm('Supprimer ce puits ?')) { remove(well.id); router.push('/wells') } }}>Supprimer</button>
            <button className="bg-gray-200 px-3 py-2 rounded" onClick={()=>router.push(`/dashboard/${well.id}`)}>Modifier</button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-white border rounded">
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-gray-500">Sexe</dt><dd>{well.sex}</dd>
              <dt className="text-gray-500">Commune</dt><dd>{well.commune}</dd>
              <dt className="text-gray-500">Quartier</dt><dd>{well.quartier ?? '—'}</dd>
              <dt className="text-gray-500">Avenue</dt><dd>{well.avenue}</dd>
              <dt className="text-gray-500">Capacité (L)</dt><dd>{well.capacityLiters ?? 'n/d'}</dd>
              <dt className="text-gray-500">Année</dt><dd>{well.constructionYear ?? 'n/d'}</dd>
              <dt className="text-gray-500">Trimestre</dt><dd>{well.trimester ?? 'n/d'}</dd>
              <dt className="text-gray-500">Coordonnées</dt><dd>{well.latitude}, {well.longitude}</dd>
              <dt className="text-gray-500">Notes</dt><dd className="col-span-1 md:col-span-1">{well.notes ?? '—'}</dd>
            </dl>
          </div>
          <div className="p-2 bg-white border rounded">
            <WellsMap wells={[well]} height={360} />
          </div>
        </div>
      </main>
    </div>
  )
}


