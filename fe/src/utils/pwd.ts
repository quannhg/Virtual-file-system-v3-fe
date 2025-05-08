export const updatePwdLocalStorage = (newPwd: string): void => {
  localStorage.setItem('pwd', newPwd);
};

export const readPwdLocalStorage = (): string => {
  let pwd = localStorage.getItem('pwd');
  if (pwd === null) {
    pwd = '';
    localStorage.setItem('pwd', pwd);
  }
  return pwd;
};
