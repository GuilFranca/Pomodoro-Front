import {
  HistoryIcon,
  HouseIcon,
  LogOutIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
} from 'lucide-react';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import { RouterLink } from '../RouterLink';
import { useAuthContext } from '../../contexts/TaskContext';
import { useNavigate } from 'react-router';

type AvailableThemes = 'dark' | 'light';

export function Menu() {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const [theme, setTheme] = useState<AvailableThemes>(() => {
    return (localStorage.getItem('theme') as AvailableThemes) || 'dark';
  });

  const nextThemeIcon = { dark: <SunIcon />, light: <MoonIcon /> };

  function handleThemeChange(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }

  function handleLogout(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    logout();
    navigate('/');
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <nav className={styles.menu}>
      <RouterLink className={styles.menuLink} href='/home' aria-label='Ir para a Home' title='Home'>
        <HouseIcon />
      </RouterLink>

      <RouterLink className={styles.menuLink} href='/history/' aria-label='Ver Histórico' title='Histórico'>
        <HistoryIcon />
      </RouterLink>

      <RouterLink className={styles.menuLink} href='/settings/' aria-label='Configurações' title='Configurações'>
        <SettingsIcon />
      </RouterLink>

      <a className={styles.menuLink} href='#' aria-label='Mudar Tema' title='Mudar Tema' onClick={handleThemeChange}>
        {nextThemeIcon[theme]}
      </a>

      <a className={styles.menuLink} href='#' aria-label='Sair' title='Sair' onClick={handleLogout}>
        <LogOutIcon />
      </a>
    </nav>
  );
}
