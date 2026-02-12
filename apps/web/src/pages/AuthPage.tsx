import { useState } from 'react';
import { useAuth } from '../app/auth';
import { api } from '../lib/api';

export default function AuthPage() {
  const { signInEmail, signUpEmail, sendOtp, verifyOtp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [tab, setTab] = useState<'email' | 'phone'>('email');
  const [confirmation, setConfirmation] = useState<any>(null);

  async function submitEmail(e: any) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get('email'));
    const password = String(fd.get('password'));
    const name = String(fd.get('name') || '');
    if (mode === 'signin') await signInEmail(email, password);
    else {
      await signUpEmail(email, password);
      await api.get('/me');
    }
  }

  async function send(e: any) {
    e.preventDefault();
    const phone = e.currentTarget.phone.value;
    setConfirmation(await sendOtp(phone));
  }

  async function verify(e: any) {
    e.preventDefault();
    const code = e.currentTarget.code.value;
    await verifyOtp(confirmation, code);
    await api.get('/me');
  }

  return <div className="mx-auto mt-12 max-w-md card">
    <h1 className="mb-4 text-xl font-semibold">{mode === 'signin' ? 'Kirish' : 'Ro\'yxatdan o\'tish'}</h1>
    <div className="mb-4 flex gap-2"><button className="btn-secondary" onClick={()=>setMode('signin')}>Kirish</button><button className="btn-secondary" onClick={()=>setMode('signup')}>Ro\'yxatdan o\'tish</button></div>
    <div className="mb-4 flex gap-2"><button className="btn-secondary" onClick={()=>setTab('email')}>Email + Parol</button><button className="btn-secondary" onClick={()=>setTab('phone')}>Telefon + OTP</button></div>
    {tab==='email' ? <form onSubmit={submitEmail} className="space-y-3">{mode==='signup' && <input name="name" className="input" placeholder="Ism" />}<input name="email" className="input" placeholder="Email" /><input type="password" name="password" className="input" placeholder="Parol" /><button className="btn-primary w-full">Davom etish</button></form> : <div className="space-y-3">{!confirmation ? <form onSubmit={send} className="space-y-3"><input name="phone" className="input" placeholder="+998901234567"/><button className="btn-primary w-full">OTP yuborish</button></form> : <form onSubmit={verify} className="space-y-3"><input name="code" className="input" placeholder="OTP kod"/><button className="btn-primary w-full">Tasdiqlash</button></form>}<div id="recaptcha-container" /></div>}
  </div>;
}
