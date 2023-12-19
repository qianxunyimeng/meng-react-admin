import { useCallback, useReducer, useState } from "react";
import { useMountedRef } from "./useMountedRef";

interface State<D> {
  error: Error | null;
  data: D | null;
  stat: "idle" | "loading" | "error" | "success";
}

const defaultInitalState: State<null> = {
  stat: "idle",
  data: null,
  error: null,
};

const defaultConfig = {
  throwOnError: false,
};

export const useAsyncHandle = <D>(
  initalState?: State<D>,
  initConfig?: typeof defaultConfig
) => {
  const config = { ...defaultConfig, initConfig };
  const [state, setState] = useState<State<D>>({
    ...defaultInitalState,
    ...initalState,
  });

  const mountedRef = useMountedRef();

  //useState 惰性初始化
  const [retry, setRetry] = useState(() => {
    return () => {};
  });

  const setData = useCallback((data: D) => {
    setState({
      data,
      stat: "success",
      error: null,
    });
  }, []);

  const setError = useCallback((error: Error) => {
    setState({
      error,
      stat: "error",
      data: null,
    });
  }, []);
  // run用来出发异步请求
  const run = useCallback(
    (promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
      if (!promise || !promise.then) {
        throw new Error("请传入 Promise 类型的数据 !!!");
      }

      setRetry(() => {
        return () => {
          if (runConfig?.retry) {
            run(runConfig?.retry(), runConfig);
          }
        };
      });
      //setState({ ...state, stat: "loading" });
      //setstate的第二种用法，传入一个函数
      setState((preState) => ({ ...preState, stat: "loading" }));

      return promise
        .then((data) => {
          if (mountedRef.current) setData(data);
          return data;
        })
        .catch((err) => {
          setError(err);
          if (config.throwOnError) return Promise.reject(err);
          return err;
        });
    },
    [config.throwOnError, mountedRef, setData, setError]
  );

  return {
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isError: state.stat === "error",
    isSuccess: state.stat === "success",
    run,
    setData,
    setError,
    retry,
    ...state,
  };
};

const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
  const mountedRef = useMountedRef();
  return useCallback(
    (...args: T[]) => (mountedRef.current ? dispatch(...args) : void 0),
    [dispatch, mountedRef]
  );
};

export const useAsyncReducer = <D>(
  initalState?: State<D>,
  initConfig?: typeof defaultConfig
) => {
  const config = { ...defaultConfig, initConfig };
  const [state, dispatch] = useReducer(
    (state: State<D>, action: Partial<State<D>>) => ({ ...state, ...action }),
    {
      ...defaultInitalState,
      ...initalState,
    }
  );

  const safeDispatch = useSafeDispatch(dispatch);

  //useState 惰性初始化
  const [retry, setRetry] = useState(() => {
    return () => {};
  });

  const setData = useCallback(
    (data: D) => {
      safeDispatch({
        data,
        stat: "success",
        error: null,
      });
    },
    [safeDispatch]
  );

  const setError = useCallback(
    (error: Error) => {
      safeDispatch({
        error,
        stat: "error",
        data: null,
      });
    },
    [safeDispatch]
  );
  // run用来出发异步请求
  const run = useCallback(
    (promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
      if (!promise || !promise.then) {
        throw new Error("请传入 Promise 类型的数据 !!!");
      }

      setRetry(() => {
        return () => {
          if (runConfig?.retry) {
            run(runConfig?.retry(), runConfig);
          }
        };
      });
      //setState({ ...state, stat: "loading" });
      //setstate的第二种用法，传入一个函数
      safeDispatch({ stat: "loading" });

      return promise
        .then((data) => {
          setData(data);
          return data;
        })
        .catch((err) => {
          setError(err);
          if (config.throwOnError) return Promise.reject(err);
          return err;
        });
    },
    [config.throwOnError, setData, setError, safeDispatch]
  );

  return {
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isError: state.stat === "error",
    isSuccess: state.stat === "success",
    run,
    setData,
    setError,
    retry,
    ...state,
  };
};
