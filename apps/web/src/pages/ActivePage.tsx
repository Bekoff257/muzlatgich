import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

const dayMs = 86400000;
const storedDays = (a: string, b: string) => Math.floor((new Date(b).setHours(0,0,0,0)-new Date(a).setHours(0,0,0,0))/dayMs)+1;

export default function ActivePage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ['active', search], queryFn: async () => (await api.get('/storage-records', { params: { status: 'ACTIVE', search } })).data });
  const del = useMutation({ mutationFn: (id:string)=>api.delete(`/storage-records/${id}`), onSuccess:()=>qc.invalidateQueries({queryKey:['active']})});
  const checkout = useMutation({ mutationFn: (payload:any)=>api.post(`/storage-records/${selected._id}/checkout`, payload), onSuccess:()=>{qc.invalidateQueries({queryKey:['active']}); setCheckoutOpen(false); setSelected(null);} });

  return <div className="space-y-4">
    <input className="input" placeholder="Qidirish" value={search} onChange={(e)=>setSearch(e.target.value)} />
    <div className="grid gap-3 md:grid-cols-2">{data.map((r:any)=><div key={r._id} className="card"><p className="font-semibold">{r.firstName} {r.lastName}</p><p>{r.phone}</p><p>{r.productName} - {r.productTypeId?.name}</p><p>{r.kg} kg / {r.containerCount} {r.containerType}</p><p>{new Date(r.checkInDate).toLocaleDateString()} / {r.roomId?.name}</p><button className="btn-primary mt-2" onClick={()=>setSelected(r)}>Ko'rish</button></div>)}</div>
    {selected && <div className="fixed inset-0 bg-black/40 p-4"><div className="mx-auto max-w-lg card"><h3 className="font-semibold">Mijoz haqida</h3><p>{selected.firstName} {selected.lastName}</p><p>Saqlangan vaqt: {storedDays(selected.checkInDate,new Date().toISOString())} kun</p><div className="mt-3 flex gap-2"><button className="btn-secondary" onClick={()=>del.mutate(selected._id)}>O'chirish</button><button className="btn-primary" onClick={()=>setCheckoutOpen(true)}>Hisob-kitob</button><button className="btn-secondary" onClick={()=>setSelected(null)}>Yopish</button></div></div></div>}
    {checkoutOpen && selected && <CheckoutModal record={selected} onClose={()=>setCheckoutOpen(false)} onSubmit={(p)=>checkout.mutate(p)} />}
  </div>;
}

function CheckoutModal({ record, onClose, onSubmit }: any) {
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [price, setPrice] = useState<number>(1000);
  const [type, setType] = useState<'CASH'|'DEBT'>('CASH');
  const days = storedDays(record.checkInDate, date);
  const total = days * record.kg * price;
  return <div className="fixed inset-0 bg-black/40 p-4"><div className="mx-auto max-w-lg card space-y-2"><h3 className="font-semibold">Hisob-kitob</h3><p>Kiritilgan sana: {new Date(record.checkInDate).toLocaleDateString()}</p><input type="date" className="input" value={date} onChange={(e)=>setDate(e.target.value)} /><input type="number" className="input" value={price} onChange={(e)=>setPrice(Number(e.target.value))} /><div className="flex gap-4"><label><input type="radio" checked={type==='CASH'} onChange={()=>setType('CASH')} /> Naqd to'lov</label><label><input type="radio" checked={type==='DEBT'} onChange={()=>setType('DEBT')} /> Qarzdor qoldirish</label></div><p>Saqlangan kun: {days}</p><p>Umumiy summa: {total}</p><div className="flex gap-2"><button className="btn-secondary" onClick={onClose}>Bekor qilish</button><a className="btn-secondary" href="#">Excelda chiqarish</a><button className="btn-primary" onClick={()=>onSubmit({ checkOutDate: date, dailyPricePerKg: price, paymentType: type })}>Yakunlash</button></div></div></div>;
}
