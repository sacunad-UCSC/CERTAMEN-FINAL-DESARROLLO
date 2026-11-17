import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// # MFA GOOGLE AUTHENTICATOR: vinculacion inicial y segundo factor obligatorio.
export default function MFAChallenge({ challenge, onCancel, onSuccess }) {
  const { mfaSetup, mfaConfirm, mfaVerify } = useAuth();
  const [setup, setSetup] = useState(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  // # MFA: generar clave inicial sólo si la cuenta no tiene Authenticator activado.
  useEffect(() => {
    let active = true;
    if (challenge.setupRequired) {
      Promise.resolve()
        .then(() => mfaSetup(challenge.challengeToken))
        .then(res => {
          if (active) res?.success ? setSetup(res) : setError(res?.message || 'No se pudo generar la clave');
        })
        .catch(() => { if (active) setError('No se pudo contactar con la API de MFA'); });
    }
    return () => { active = false; };
  }, [challenge.challengeToken, challenge.setupRequired]);

  // # MFA: finalizar sesión sólo cuando el backend entregue un JWT de sesión válido.
  const submit = async e => {
    e.preventDefault();
    if (busy || (challenge.setupRequired && !setup)) return;
    setBusy(true); setError('');
    try {
      const res = challenge.setupRequired
        ? await mfaConfirm(challenge.challengeToken, code)
        : await mfaVerify(challenge.challengeToken, code);
      if (res?.success) onSuccess?.();
      else setError(res?.message || 'No se pudo validar el código');
    } catch (err) {
      setError('Error al contactar con el servidor');
    } finally {
      setBusy(false);
    }
  };
  return <div style={{padding:20, border:'1px solid #9ca3af', borderRadius:12, background:'white', color:'#0f172a'}}>
    <h3 style={{fontWeight:800, fontSize:18}}>Verificación Google Authenticator</h3>
    {challenge.setupRequired ? <>
      <p>Primera vez: escanea el QR con Google Authenticator o ingresa la clave manual.</p>
      <p>Cuenta: <strong>NexoPC</strong> · Tipo: <strong>Basado en tiempo</strong></p>
      {setup?.otpauthUrl && (
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(setup.otpauthUrl)}`}
          alt="QR Google Authenticator"
          style={{ display: 'block', margin: '10px auto', borderRadius: 8 }}
        />
      )}
      <p style={{ wordBreak: 'break-all' }}>
        Clave manual: <code>{setup?.secret || 'Preparando...'}</code>
      </p>
      <p style={{ fontSize: 12 }}>Guarda esta clave en privado. No la compartas.</p>
    </> : <p>Introduce el código de seis dígitos que aparece en tu aplicación.</p>}
    {error && <p role="alert" style={{color:'#b91c1c'}}>{error}</p>}
    <form onSubmit={submit}>
      <input aria-label="Código Google Authenticator" inputMode="numeric" autoComplete="one-time-code"
        pattern="[0-9]{6}" maxLength={6} required value={code}
        onChange={e => setCode(e.target.value.replace(/\D/g,'').slice(0,6))}
        placeholder="Código de 6 dígitos" style={{width:'100%',padding:12,boxSizing:'border-box',margin:'8px 0'}}/>
      <button type="submit" disabled={busy || (challenge.setupRequired && !setup)}
        style={{padding:12,background:'#008ecc',color:'white',border:0,borderRadius:8,marginRight:8}}>
        {busy ? 'Validando...' : challenge.setupRequired ? 'Activar y entrar' : 'Verificar y entrar'}
      </button>
      <button type="button" onClick={onCancel} style={{padding:12}}>Cancelar</button>
    </form>
  </div>;
}
