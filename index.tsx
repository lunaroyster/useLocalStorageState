import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";

export type StateType = Record<string, any>;

export type ReducerActionType =
  | { type: "set"; key: string; value: any }
  | { type: "init"; key: string; value: any }
  | { type: "clear"; key: string; value: any };
export interface LocalStorageContextState {
  state: StateType;
  getItem: <T>(key: string) => T;
  setItem: <T>(key: string, initialValue: T) => void;
  initItem: <T>(key: string, initialValue: T) => void;
}

const LocalStorageContext = createContext<LocalStorageContextState>({
  state: {},
  setItem: () => {},
  getItem: () => null,
  initItem: () => {},
});

export function useLocalStorageState<T>(name: string, initialValue: T) {
  const { state, setItem, initItem } = useContext(LocalStorageContext);

  useEffect(() => {
    initItem(name, initialValue);
  }, []);

  const setValue = useCallback(
    (value) => {
      setItem(name, value);
    },
    [setItem]
  );

  return [state[name], setValue];
}

export function LocalStorageContextProvider({ children }) {
  const [state, dispatch] = useReducer<
    (s: StateType, action: ReducerActionType) => StateType
  >((state, action) => {
    if (action.type === "set") {
      return { ...state, [action.key]: action.value };
    } else if (action.type === "init") {
      // bail if state is already defined
      if (state[action.key]) {
        return state;
      }

      return { ...state, [action.key]: action.value };
    } else if (action.type === "clear") {
      const newState = { ...state };
      delete newState[action.key];
      return newState;
    }
  }, {});

  const setItem = useCallback((key: string, value: any) => {
    window.localStorage.setItem(key, JSON.stringify(value));
    dispatch({ type: "set", key, value });
  }, []);

  const getItem: <T>(key: string) => T = useCallback(
    (key: string) => {
      return state[key];
    },
    [state]
  );

  const initItem = useCallback(
    function <T>(key: string, initialValue: T) {
      if (state[key]) {
        return;
      }

      const existingValue = window.localStorage.getItem(key);

      dispatch({
        type: "init",
        key,
        value: JSON.parse(existingValue) ?? initialValue,
      });
    },
    [state]
  );

  return (
    <LocalStorageContext.Provider value={{ state, setItem, getItem, initItem }}>
      {children}
    </LocalStorageContext.Provider>
  );
}
