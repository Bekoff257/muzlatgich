import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from '../lib/api';

const schema = z.object({
  firstName: z.string().min(1), lastName: z.string().min(1), phone: z.string().regex(/^\+998\d{9}$/), roomId: z.string().min(1), note: z.string().optional(),
  productName: z.string().min(1), productTypeId: z.string().min(1), kg: z.coerce.number().positive(), containerType: z.enum(['YASHIK','QOP','KARZINKA']),
  containerCount: z.coerce.number().int().min(0), checkInDate: z.string().min(1)
});

export default function AddRecordPage() {
  const { data: rooms = [] } = useQuery({ queryKey: ['rooms'], queryFn: async () => (await api.get('/rooms')).data });
  const { data: types = [] } = useQuery({ queryKey: ['product-types'], queryFn: async () => (await api.get('/product-types')).data });
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(schema), defaultValues: { checkInDate: new Date().toISOString().slice(0,10), containerType: 'YASHIK' } });
  const mutation = useMutation({ mutationFn: (payload: any) => api.post('/storage-records', payload), onSuccess: () => reset() });

  return <form onSubmit={handleSubmit((v)=>mutation.mutate(v))} className="grid gap-4 md:grid-cols-2">
    <div className="card space-y-3">
      <h2 className="font-semibold">Mijoz ma\'lumotlari</h2>
      <input className="input" placeholder="Ism" {...register('firstName')} />
      <input className="input" placeholder="Familiya" {...register('lastName')} />
      <input className="input" placeholder="Telefon raqam" {...register('phone')} />
      <select className="input" {...register('roomId')}><option value="">Xona tanlang</option>{rooms.map((r:any)=><option key={r._id} value={r._id}>{r.name}</option>)}</select>
      <textarea className="input" placeholder="Qo'shimcha izoh" {...register('note')} />
    </div>
    <div className="card space-y-3">
      <h2 className="font-semibold">Mahsulot</h2>
      <input className="input" placeholder="Mahsulot nomi" {...register('productName')} />
      <select className="input" {...register('productTypeId')}><option value="">Mahsulot navi</option>{types.map((t:any)=><option key={t._id} value={t._id}>{t.name}</option>)}</select>
      <input type="number" className="input" placeholder="Miqdori (kg)" {...register('kg')} />
      <div className="flex gap-4">{['YASHIK','QOP','KARZINKA'].map((c)=><label key={c}><input type="radio" value={c} {...register('containerType')} /> {c}</label>)}</div>
      <input type="number" className="input" placeholder="Idish soni" {...register('containerCount')} />
      <input type="date" className="input" {...register('checkInDate')} />
      <button className="btn-primary w-full" disabled={mutation.isPending}>Saqlash</button>
      {Object.keys(errors).length>0 && <p className="text-sm text-red-600">Maydonlarni tekshiring</p>}
    </div>
  </form>;
}
