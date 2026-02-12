import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export default function ArchivePage() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const { data = [] } = useQuery({ queryKey: ['archive', search, sort], queryFn: async () => (await api.get('/invoices', { params: { search, sort } })).data });

  return <div className="space-y-4"><div className="flex gap-2"><input className="input" placeholder="Qidirish" value={search} onChange={(e)=>setSearch(e.target.value)} /><select className="input max-w-56" value={sort} onChange={(e)=>setSort(e.target.value)}><option value="newest">Sana (yangi → eski)</option><option value="oldest">Sana (eski → yangi)</option></select></div>
    <div className="space-y-2">{data.map((i:any)=><div className="card" key={i._id}><p className="font-semibold">{i.fullName} ({i.phone})</p><p>{i.productName} / {i.productTypeName}</p><p>{new Date(i.checkInDate).toLocaleDateString()} - {new Date(i.checkOutDate).toLocaleDateString()}</p><p>{i.totalSum} so'm ({i.paymentStatus})</p><a className="text-blue-600" href={`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/invoices/${i._id}/export/xlsx`} target="_blank">Excelda chiqarish</a></div>)}</div>
  </div>;
}
