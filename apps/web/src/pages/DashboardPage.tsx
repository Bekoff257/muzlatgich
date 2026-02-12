import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export default function DashboardPage() {
  const { data } = useQuery({ queryKey: ['stats'], queryFn: async () => (await api.get('/stats/summary')).data });
  const cards = [
    ['Jami mijozlar', data?.totalActiveClients || 0],
    ['Qarzdorlar', data?.totalDebtorsCount || 0],
    ['Jami mahsulotlar', `${data?.totalKgStoredActive || 0} kg`]
  ];
  return <div className="grid gap-4 md:grid-cols-3">{cards.map(([t,v])=><div key={t} className="card"><p className="text-sm text-slate-500">{t}</p><p className="text-2xl font-bold">{v}</p></div>)}</div>;
}
