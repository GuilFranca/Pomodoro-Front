import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { DefaultInput } from '../../components/DefaultInput';
import { authApi } from '../../services/api';
import { showMessage } from '../../adapters/showMessage';
import styles from '../Login/styles.module.css';

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) { showMessage.error('Token inválido. Solicite um novo link.'); return; }
    if (password.length < 6) { showMessage.warn('A senha deve ter pelo menos 6 caracteres'); return; }
    if (password !== confirm) { showMessage.warn('As senhas não coincidem'); return; }

    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
      showMessage.success('Senha redefinida com sucesso!');
    } catch (err) {
      showMessage.error(err instanceof Error ? err.message : 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrap} data-panel="RESET">
      <div className={styles.card}>
        {done ? (
          <>
            <h1 className={styles.title}>Tudo certo</h1>
            <p className={styles.subtitle}>Sua senha foi redefinida com sucesso.</p>
            <button type="button" className={styles.btnPrimary} onClick={() => navigate('/')}>
              Ir para o login
            </button>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Nova senha</h1>
            <p className={styles.subtitle}>Escolha uma senha segura para sua conta</p>

            {!token && (
              <p className={styles.infoBox} style={{ color: '#e31c1c' }}>
                Token não encontrado. Verifique o link ou solicite um novo.
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.field}>
                <DefaultInput id="reset-pass" labelText="Nova senha (mín. 6 caracteres)" type="password"
                  value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div className={styles.field}>
                <DefaultInput id="reset-confirm" labelText="Confirmar nova senha" type="password"
                  value={confirm} onChange={e => setConfirm(e.target.value)} />
              </div>
              <button type="submit" className={styles.btnPrimary} disabled={loading || !token}>
                {loading ? 'Salvando…' : 'Redefinir senha'}
              </button>
            </form>

            <div className={styles.forgot} style={{ marginTop: '1.5rem' }}>
              <button type="button" onClick={() => navigate('/')}>
                ← Voltar ao login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
