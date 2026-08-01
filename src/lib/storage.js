const STORAGE_KEY = 'f-casa-ec:v1';

// localStorage puede fallar en modo incógnito o si se llena la cuota. Nada de
// esto debe romper la app: si no se puede guardar, se sigue en memoria y la UI
// avisa que los cambios no van a sobrevivir a un refresh.
export const isStorageAvailable = () => {
  try {
    const probe = `${STORAGE_KEY}:probe`;
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
};

export const readState = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const writeState = (state) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
};

export const clearStoredState = () => {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
};
