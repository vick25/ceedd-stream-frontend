"use client"
import Papa from 'papaparse'
import { Well } from '@/types/well'
import { useWellsStore } from '@/store/wells'

export function CsvControls() {
  const setWells = useWellsStore(s => s.setWells)
  const wells = useWellsStore(s => s.wells)

  function exportCsv() {
    const csv = Papa.unparse(wells)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'wells.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function importCsv(file: File) {
    Papa.parse<Well>(file, {
      header: true,
      dynamicTyping: true,
      complete: (res) => {
        const rows = (res.data ?? []).filter(Boolean) as unknown as Well[]
        // Ensure ids
        const normalized = rows.map((r) => ({ ...r, id: r.id || crypto.randomUUID() }))
        setWells(normalized)
      },
    })
  }

  return (
    <div className="flex flex-wrap gap-2">
      <label className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded cursor-pointer">
        Import CSV
        <input type="file" accept=".csv" className="hidden" onChange={(e)=>{ const f=e.target.files?.[0]; if(f) importCsv(f) }} />
      </label>
      <button onClick={exportCsv} className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded">Export CSV</button>
    </div>
  )
}


