import { createContext, useContext, useEffect, useRef } from "react";
import { Vector } from "matter-js";

interface InputContext {
  keys: React.MutableRefObject<Record<string, boolean>>;
  control: React.MutableRefObject<Vector>;
}

export const context = createContext({} as InputContext);
export const useInput = () => useContext(context);
export const InputProvider = ({ children }: { children: React.ReactNode }) => {
  const keys = useRef<Record<string, boolean>>({});
  const control = useRef(Vector.create(0, 0));

  useEffect(() => {
    const eventListener = (event: KeyboardEvent) => {
      keys.current[event.key] = true;
      control.current.x = keys.current.ArrowRight ? 1 : keys.current.ArrowLeft ? -1 : 0;
      control.current.y = keys.current.ArrowDown ? 1 : keys.current.ArrowUp ? -1 : 0;
      control.current = Vector.normalise(control.current);
    };
    window.addEventListener("keydown", eventListener);
    return () => window.removeEventListener("keydown", eventListener);
  }, []);

  useEffect(() => {
    const eventListener = (event: KeyboardEvent) => {
      keys.current[event.key] = false;
      control.current.x = keys.current.ArrowRight ? 1 : keys.current.ArrowLeft ? -1 : 0;
      control.current.y = keys.current.ArrowDown ? 1 : keys.current.ArrowUp ? -1 : 0;
      control.current = Vector.normalise(control.current);
    };
    window.addEventListener("keyup", eventListener);
    return () => window.removeEventListener("keyup", eventListener);
  }, []);

  return (
    <context.Provider value={{ keys, control }}>
      {children}
    </context.Provider>
  );
}
