import { useEffect, useReducer, useRef, useCallback } from 'react';
import { initialTaskState } from './initialTaskState';
import { taskReducer } from './taskReducer';
import { TaskContext } from './TaskContext';
import { TimerWorkerManager } from '../../workers/TimerWorkerManager';
import { TaskActionTypes } from './taskActions';
import { loadBeep } from '../../utils/loadBeep';
import type { TaskStateModel } from '../../models/TaskStateModel';
import type { TaskModel } from '../../models/TaskModel';
import { settingsApi, tasksApi } from '../../services/api';
import { showMessage } from '../../adapters/showMessage';

type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState, () => {
    const storageState = localStorage.getItem('state');
    if (storageState === null) return initialTaskState;
    const parsedStorageState = JSON.parse(storageState) as TaskStateModel;
    return {
      ...parsedStorageState,
      activeTask: null,
      secondsRemaining: 0,
      formattedSecondsRemaining: '00:00',
    };
  });

  const playBeepRef = useRef<ReturnType<typeof loadBeep> | null>(null);
  const worker = TimerWorkerManager.getInstance();

  // Carregar settings da API no startup
  useEffect(() => {
    settingsApi.get()
      .then(settings => {
        dispatch({
          type: TaskActionTypes.CHANGE_SETTINGS,
          payload: {
            workTime: settings.workTime,
            shortBreakTime: settings.shortBreakTime,
            longBreakTime: settings.longBreakTime,
          },
        });
      })
      .catch(() => {
        // silencioso: mantém valores do localStorage/initial
      });
  }, []);

  // Carregar historico da API no startup
  useEffect(() => {
    tasksApi.list()
      .then(apiTasks => {
        const mapped: TaskModel[] = apiTasks.map(t => ({
          id: t.id,
          name: t.name,
          duration: t.duration,
          type: t.type as TaskModel['type'],
          startDate: Number(t.startDate),
          completeDate: t.completeDate ? Number(t.completeDate) : null,
          interruptDate: t.interruptDate ? Number(t.interruptDate) : null,
        }));
        dispatch({ type: TaskActionTypes.LOAD_TASKS, payload: mapped });
      })
      .catch(() => {
        // silencioso: mantém tasks do localStorage
      });
  }, []);

  // Timer worker
  useEffect(() => {
    worker.onmessage(e => {
      const countDownSeconds = e.data;
      if (countDownSeconds <= 0) {
        if (playBeepRef.current) {
          playBeepRef.current();
          playBeepRef.current = null;
        }
        dispatch({ type: TaskActionTypes.COMPLETE_TASK });
        worker.terminate();
      } else {
        dispatch({
          type: TaskActionTypes.COUNT_DOWN,
          payload: { secondsRemaining: countDownSeconds },
        });
      }
    });
  }, [worker]);

  useEffect(() => {
    localStorage.setItem('state', JSON.stringify(state));
    if (!state.activeTask) worker.terminate();
    document.title = `${state.formattedSecondsRemaining} - Chronos Pomodoro`;
    worker.postMessage(state);
  }, [worker, state]);

  useEffect(() => {
    if (state.activeTask && playBeepRef.current === null) {
      playBeepRef.current = loadBeep();
    } else {
      playBeepRef.current = null;
    }
  }, [state.activeTask]);

  // dispatch com sincronizacao para API
  const dispatchWithApi = useCallback(
    async (action: Parameters<typeof dispatch>[0]) => {
      dispatch(action);

      try {
        if (action.type === TaskActionTypes.START_TASK) {
          const task = action.payload;
          await tasksApi.create({
            id: task.id,
            name: task.name,
            duration: task.duration,
            type: task.type,
            startDate: task.startDate,
          });
        }

        if (action.type === TaskActionTypes.COMPLETE_TASK && state.activeTask) {
          await tasksApi.complete(state.activeTask.id, Date.now());
        }

        if (action.type === TaskActionTypes.INTERRUPT_TASK && state.activeTask) {
          await tasksApi.interrupt(state.activeTask.id, Date.now());
        }

        if (action.type === TaskActionTypes.RESET_STATE) {
          await tasksApi.deleteAll();
        }

        if (action.type === TaskActionTypes.CHANGE_SETTINGS) {
          await settingsApi.update(action.payload);
          showMessage.success('Configuracoes salvas no servidor');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro de rede';
        showMessage.error(`Erro ao sincronizar com API: ${message}`);
      }
    },
    [state.activeTask],
  );

  return (
    <TaskContext.Provider value={{ state, dispatch: dispatchWithApi }}>
      {children}
    </TaskContext.Provider>
  );
}
