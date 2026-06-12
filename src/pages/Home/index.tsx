import { useEffect } from 'react';
import { Container } from '../../components/Container';
import { CountDown } from '../../components/CountDown';
import { MainForm } from '../../components/MainForm';
import { MainTemplate } from '../../templates/MainTemplate';
import { useAuthContext } from '../../contexts/TaskContext';
import styles from './styles.module.css';

export function Home() {
  const { user } = useAuthContext();

  useEffect(() => {
    document.title = 'Chronos Pomodoro';
  }, []);

  return (
    <MainTemplate>
      {user && (
        <Container>
          <p className={styles.welcome}>
            Olá, <strong>{user.name}</strong>! Pronto para focar? 🍅
          </p>
        </Container>
      )}

      <Container>
        <CountDown />
      </Container>

      <Container>
        <MainForm />
      </Container>
    </MainTemplate>
  );
}
