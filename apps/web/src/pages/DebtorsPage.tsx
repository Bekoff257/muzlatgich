import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export default function DebtorsPage({ mine = false }: { mine?: boolean }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ['debts', mine, search], queryFn: async () => (await api.get('/debts', { params: { search, mine } })).data });
  const pay = useMutation({ mutationFn: ({id, amount}:{id:string;amount:number}) => api.post(`/debts/${id}/payments`, { amount, method: 'CASH' }), onSuccess:()=>qc.invalidateQueries({queryKey:['debts']}) });

  return <div className="space-y-4"><input className="input" placeholder="Qidirish" value={search} onChange={(e)=>setSearch(e.target.value)} />
    <div className="grid gap-3 md:grid-cols-2">{data.map((d:any)=><div key={d._id} className="card"><p className="font-semibold">{d.debtorName}</p><p>{d.phone}</p><p>{d.amountDue} / {d.amountPaid}</p><p>Holat: {d.status}</p><button className="btn-primary" onClick={()=>setSelected(d)}>Ko'rish</button></div>)}</div>
    {selected && <div className="fixed inset-0 bg-black/40 p-4"><div className="mx-auto max-w-md card space-y-2"><p>{selected.debtorName}</p><p>Qoldiq: {selected.amountDue-selected.amountPaid}</p><input id="payAmount" className="input" type="number" placeholder="To'lov summasi" /><div className="flex gap-2"><button className="btn-primary" onClick={()=>pay.mutate({id:selected._id, amount:Number((document.getElementById('payAmount') as HTMLInputElement).value)})}>To'lov qo'shish</button><button className="btn-secondary" onClick={()=>setSelected(null)}>Yopish</button></div></div></div>}
  </div>;
}
