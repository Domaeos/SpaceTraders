import { useEffect, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

type IBarTint = 'info' | 'success' | 'warning' | 'danger';

export default function InfoBar({ current, full, isTintEnabled = true, reverseTint = false }:
  { current: number, full: number, isTintEnabled?: boolean, reverseTint?: boolean }) {

  const [tint, setTint] = useState<IBarTint>('info');
  const [emptyBar, setEmptyBar] = useState<boolean>(false);

  useEffect(() => {
    if (current === 0 && full === 0) {
      setEmptyBar(true);
      return;
    }
    if (isTintEnabled) {
      if (current / full >= 0.90) {
        !reverseTint ? setTint('success') : setTint('danger');
      } else if (current / full >= 0.8) {
        !reverseTint ? setTint('info') : setTint('warning');
      } else if (current / full <= 0.10) {
        !reverseTint ? setTint('danger') : setTint('success');
      } else if (current / full <= 0.20) {
        !reverseTint ? setTint('warning') : setTint('info');
      } else {
        setTint('info');
      }
    }
  }, [current]);

  return (
    <ProgressBar
      variant={tint}
      className={emptyBar ? "progress-empty-bar" : ""}
      now={emptyBar ? 1 : current} max={emptyBar ? 1 : full}
      label={emptyBar ? "0/0" : `${current}/${full}`} />
  )
};