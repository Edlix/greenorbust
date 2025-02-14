import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const gmt1Time = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
      setTime(gmt1Time.toLocaleTimeString());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '18px' }}>
      Current Time (GMT+1): {time}
    </div>
  );
};

export default Clock;