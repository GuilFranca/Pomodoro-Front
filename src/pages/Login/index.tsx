import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { DefaultInput } from '../../components/DefaultInput';
import { useAuthContext } from '../../contexts/TaskContext';
import { authApi } from '../../services/api';
import { showMessage } from '../../adapters/showMessage';
import styles from './styles.module.css';

type View = 'login' | 'register' | 'forgot' | 'forgot-sent';

export function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuthContext();

  const [view, setView] = useState<View>('login');
  const [loading, setLoading] = useState(false);

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  // Forgot fields
  const [forgotEmail, setForgotEmail] = useState('');

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) { showMessage.warn('Informe o e-mail'); return; }
    if (!password) { showMessage.warn('Informe a senha'); return; }

    setLoading(true);
    try {
      await login(email.trim(), password);
      showMessage.success('Bem-vindo de volta!');
      navigate('/home');
    } catch (err) {
      showMessage.error(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    if (!regName.trim()) { showMessage.warn('Informe seu nome'); return; }
    if (!regEmail.trim()) { showMessage.warn('Informe o e-mail'); return; }
    if (regPassword.length < 6) { showMessage.warn('A senha deve ter pelo menos 6 caracteres'); return; }
    if (regPassword !== regConfirm) { showMessage.warn('As senhas não coincidem'); return; }

    setLoading(true);
    try {
      await register(regName.trim(), regEmail.trim(), regPassword);
      showMessage.success('Conta criada com sucesso!');
      navigate('/home');
    } catch (err) {
      showMessage.error(err instanceof Error ? err.message : 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot(e: FormEvent) {
    e.preventDefault();
    if (!forgotEmail.trim()) { showMessage.warn('Informe o e-mail'); return; }

    setLoading(true);
    try {
      await authApi.forgotPassword(forgotEmail.trim());
      setView('forgot-sent');
    } catch (err) {
      showMessage.error(err instanceof Error ? err.message : 'Erro ao solicitar redefinição');
    } finally {
      setLoading(false);
    }
  }

  const panelLabel = { login: 'LOGIN', register: 'CADASTRO', forgot: 'SENHA', 'forgot-sent': 'ENVIADO' }[view];

  return (
    <div className={styles.wrap} data-panel={panelLabel}>
      <div className={styles.card}>

        {/* ── LOGIN ── */}
        {view === 'login' && (
          <>
            <h1 className={styles.title}>Bem-vindo</h1>
            <p className={styles.subtitle}>Faça login para continuar</p>

            <form onSubmit={handleLogin}>
              <div className={styles.field}>
                <DefaultInput id="login-email" labelText="E-mail" type="email"
                  value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className={styles.field}>
                <DefaultInput id="login-pass" labelText="Senha" type="password"
                  value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <button type="submit" className={styles.btnPrimary} disabled={loading}>
                {loading ? 'Entrando…' : 'Entrar'}
              </button>
            </form>

            <div className={styles.divider}>ou</div>

            <button type="button" className={styles.btnGhost} onClick={() => setView('register')}>
              Criar conta
            </button>

            <div className={styles.forgot}>
              <button type="button" onClick={() => setView('forgot')}>
                Esqueci minha senha
              </button>
            </div>
          </>
        )}

        {/* ── CADASTRO ── */}
        {view === 'register' && (
          <>
            <h1 className={styles.title}>Criar conta</h1>
            <p className={styles.subtitle}>Preencha os dados para se cadastrar</p>

            <form onSubmit={handleRegister}>
              <div className={styles.field}>
                <DefaultInput id="reg-name" labelText="Nome" type="text"
                  value={regName} onChange={e => setRegName(e.target.value)} />
              </div>
              <div className={styles.field}>
                <DefaultInput id="reg-email" labelText="E-mail" type="email"
                  value={regEmail} onChange={e => setRegEmail(e.target.value)} />
              </div>
              <div className={styles.field}>
                <DefaultInput id="reg-pass" labelText="Senha (mín. 6 caracteres)" type="password"
                  value={regPassword} onChange={e => setRegPassword(e.target.value)} />
              </div>
              <div className={styles.field}>
                <DefaultInput id="reg-confirm" labelText="Confirmar senha" type="password"
                  value={regConfirm} onChange={e => setRegConfirm(e.target.value)} />
              </div>
              <button type="submit" className={styles.btnPrimary} disabled={loading}>
                {loading ? 'Cadastrando…' : 'Cadastrar'}
              </button>
            </form>

            <div className={styles.divider}>ou</div>
            <button type="button" className={styles.btnGhost} onClick={() => setView('login')}>
              Já tenho conta
            </button>
          </>
        )}

        {/* ── ESQUECI SENHA ── */}
        {view === 'forgot' && (
          <>
            <h1 className={styles.title}>Recuperar senha</h1>
            <p className={styles.subtitle}>Informe seu e-mail para receber o link de redefinição</p>

            <form onSubmit={handleForgot}>
              <div className={styles.field}>
                <DefaultInput id="forgot-email" labelText="E-mail" type="email"
                  value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} />
              </div>
              <button type="submit" className={styles.btnPrimary} disabled={loading}>
                {loading ? 'Enviando…' : 'Enviar link'}
              </button>
            </form>

            <div className={styles.forgot} style={{ marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setView('login')}>
                ← Voltar ao login
              </button>
            </div>
          </>
        )}

        {/* ── LINK ENVIADO ── */}
        {view === 'forgot-sent' && (
          <>
            <h1 className={styles.title}>Verifique seu e-mail</h1>
            <p className={styles.subtitle}>
              Se o endereço estiver cadastrado, você receberá um link para redefinir a senha em breve.
            </p>
            <p className={styles.infoBox}>
              Em ambiente de desenvolvimento, o link é exibido no console da API. Acesse
              <strong> https://ethereal.email</strong> para visualizar o e-mail capturado.
            </p>
            <button type="button" className={styles.btnGhost} onClick={() => setView('login')}>
              Voltar ao login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
