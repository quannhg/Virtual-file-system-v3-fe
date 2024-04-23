// Update PWD in local storage
export const updatePwdLocalStorage = (newPwd: string): void => {
  localStorage.setItem('pwd', newPwd);
};

// Read PWD from local storage
export const readPwdLocalStorage = (): string => {
  let pwd = localStorage.getItem('pwd');
  if (pwd === null) {
    pwd = '/';
    localStorage.setItem('pwd', pwd);
  }
  return pwd;
};
