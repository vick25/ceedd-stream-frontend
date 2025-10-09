"use client"
import { useState } from 'react'
import { Well } from '@/types/well'

export function WellForm({ initial, onSubmit }: { initial?: Partial<Well>, onSubmit: (w: Well) => void }) {
  const [form, setForm] = useState<Well>({
    id: initial?.id ?? crypto.randomUUID(),
    lastName: initial?.lastName ?? '',
    firstName: initial?.firstName ?? '',
    sex: (initial?.sex ?? 'M'),
    avenue: initial?.avenue ?? '',
    quartier: initial?.quartier ?? '',
    commune: initial?.commune ?? '',
    latitude: initial?.latitude ?? 0,
    longitude: initial?.longitude ?? 0,
    capacityLiters: initial?.capacityLiters,
    constructionYear: initial?.constructionYear,
    month: initial?.month,
    trimester: initial?.trimester,
    notes: initial?.notes,
  })

  function update<K extends keyof Well>(key: K, value: Well[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(form) }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <input className="border p-2 rounded" placeholder="Nom" value={form.lastName} onChange={e=>update('lastName', e.target.value)} />
      <input className="border p-2 rounded" placeholder="Prénom" value={form.firstName} onChange={e=>update('firstName', e.target.value)} />
      <select className="border p-2 rounded" value={form.sex} onChange={e=>update('sex', e.target.value as Well['sex'])}>
        <option value="M">M</option>
        <option value="F">F</option>
      </select>
      <input className="border p-2 rounded" placeholder="Avenue" value={form.avenue} onChange={e=>update('avenue', e.target.value)} />
      <input className="border p-2 rounded" placeholder="Quartier" value={form.quartier ?? ''} onChange={e=>update('quartier', e.target.value)} />
      <input className="border p-2 rounded" placeholder="Commune" value={form.commune} onChange={e=>update('commune', e.target.value)} />
      <input className="border p-2 rounded" type="number" step="any" placeholder="Latitude" value={form.latitude} onChange={e=>update('latitude', Number(e.target.value))} />
      <input className="border p-2 rounded" type="number" step="any" placeholder="Longitude" value={form.longitude} onChange={e=>update('longitude', Number(e.target.value))} />
      <input className="border p-2 rounded" type="number" placeholder="Capacité (L)" value={form.capacityLiters ?? ''} onChange={e=>update('capacityLiters', Number(e.target.value))} />
      <input className="border p-2 rounded" type="number" placeholder="Année de construction" value={form.constructionYear ?? ''} onChange={e=>update('constructionYear', Number(e.target.value))} />
      <input className="border p-2 rounded" placeholder="Mois" value={form.month ?? ''} onChange={e=>update('month', e.target.value)} />
      <input className="border p-2 rounded" placeholder="Trimestre" value={form.trimester ?? ''} onChange={e=>update('trimester', e.target.value)} />
      <textarea className="border p-2 rounded md:col-span-2" placeholder="Notes" value={form.notes ?? ''} onChange={e=>update('notes', e.target.value)} />
      <div className="md:col-span-2 flex gap-2">
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Enregistrer</button>
      </div>
    </form>
  )
}


