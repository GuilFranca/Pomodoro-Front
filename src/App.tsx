import { TaskContextProvider } from './contexts/TaskContext/TaskContextProvider';
import { AuthContextProvider } from './contexts/TaskContext/AuthContext';
import { MessagesContainer } from './components/MessagesContainer';
import { MainRouter } from './routers/MainRouter';
import './styles/theme.css';
import './styles/global.css';

export function App() {
  return (
    <AuthContextProvider>
      <TaskContextProvider>
        <MessagesContainer>
          <MainRouter />
        </MessagesContainer>
      </TaskContextProvider>
    </AuthContextProvider>
  );
}