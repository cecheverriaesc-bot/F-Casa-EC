import { useState } from 'react';
import { AlertTriangle, Layers, Loader2, Mail, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('sending');
    setError(null);
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    });
    if (authError) {
      setError(authError.message);
      setStatus('idle');
    } else {
      setStatus('sent');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Layers className="text-blue-600" /> Cierre Financiero
          </div>
          <p className="text-slate-500 text-sm mt-1">Casa EC</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          {status === 'sent' ? (
            <div className="text-center space-y-3">
              <Mail className="mx-auto text-emerald-500" size={32} />
              <h2 className="font-bold text-slate-800">Revisa tu correo</h2>
              <p className="text-sm text-slate-500">
                Te enviamos un enlace a <strong className="text-slate-700">{email}</strong>. Ábrelo desde este
                mismo dispositivo para entrar.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="text-xs text-blue-600 hover:underline"
              >
                Usar otro correo
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                  Tu correo
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="nombre@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 flex items-start gap-1.5">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" /> {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white rounded-md py-2.5 font-medium transition-colors"
              >
                {status === 'sending' ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Enviarme el enlace
              </button>

              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                Sin contraseñas: te llega un enlace de acceso. Sólo funcionan los correos habilitados en el hogar.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
