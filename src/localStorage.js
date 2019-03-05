export const loadState = (index) => {
    try {
      const serializedState = localStorage.getItem(index);
       if (serializedState === null) {
         return undefined; // reducer will return Redux state, as localstorage is null.
       }
      return JSON.parse(serializedState);
    } catch (err) {
      return undefined;
    }
  };

export const saveToLocalStorage = (index,state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(index, serializedState);
    } catch (err) {
      // ignore error
    }
  };