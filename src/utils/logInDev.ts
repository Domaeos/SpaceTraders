export function logInDev(log: any) {
  if (import.meta.env.VITE_STAGE === 'dev') {

    console.log(log);
  }

}