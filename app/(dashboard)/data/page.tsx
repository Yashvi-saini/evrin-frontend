import React from 'react';
import { Card, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Database } from '@/shared/ui/icons';

export default function DataPage() {
  const sources = [
    { name: 'IMD Global Forecast System (GFS)', type: 'Raw NWP', res: '12 km', cycle: '00z & 12z daily', status: 'ACTIVE' },
    { name: 'NCMRWF Unified Model (NCUM)', type: 'Ensemble NWP', res: '12 km', cycle: '00z & 12z daily', status: 'ACTIVE' },
    { name: 'IMD Gridded Daily Rainfall Analysis', type: 'Observation Benchmark', res: '0.25° x 0.25°', cycle: 'Daily retrospective', status: 'VERIFIED' },
    { name: 'INSAT-3D/3DR Hydro-Estimator Satellite', type: 'Near Real-Time Observation', res: '4 km', cycle: '15 min intervals', status: 'SYNCHRONIZED' },
    { name: 'Doppler Weather Radar (DWR) Network', type: 'Nowcasting Radar Ingestion', res: 'Grid level', cycle: '10 min updates', status: 'READY' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">Data Sources & NWP Ingestion</h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Atmospheric parameters, gridded observations, and NWP inputs fueling EVRIN calibration.
          </p>
        </div>
        <Badge variant="success">All Feeds Operational</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database size={15} className="text-sky-400" />
            <span>Operational Meteorological Feeds</span>
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-left">
                <th className="pb-2">Source Dataset</th>
                <th className="pb-2">Feed Type</th>
                <th className="pb-2">Spatial Resolution</th>
                <th className="pb-2">Update Cycle</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sources.map((s) => (
                <tr key={s.name} className="hover:bg-slate-900/40">
                  <td className="py-3 font-sans font-semibold text-slate-200">{s.name}</td>
                  <td className="py-3 text-slate-400">{s.type}</td>
                  <td className="py-3 text-sky-400">{s.res}</td>
                  <td className="py-3 text-slate-400">{s.cycle}</td>
                  <td className="py-3">
                    <Badge variant="success" size="sm">{s.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
