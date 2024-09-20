const isDevEnabled = import.meta.env.VITE_STAGE === 'dev';

export function logInDev(log: any) {
  if(isDevEnabled) {
    console.log(log);
  }
}