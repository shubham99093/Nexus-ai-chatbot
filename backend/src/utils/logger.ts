type SecurityEvent =
  | 'REGISTER_SUCCESS'
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'AUTH_FAILED';

interface SecurityLogEntry {
  timestamp: string;
  level: 'info' | 'warn';
  event: SecurityEvent;
  ip?: string;
  userId?: string;
  message?: string;
}

export function logSecurityEvent(
  event: SecurityEvent,
  details?: { ip?: string; userId?: string; message?: string },
): void {
  const entry: SecurityLogEntry = {
    timestamp: new Date().toISOString(),
    level: event.includes('FAILED') ? 'warn' : 'info',
    event,
    ...details,
  };

  if (process.env.NODE_ENV === 'production') {
    // Structured JSON in production for log aggregation
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(entry));
  } else {
    const prefix = entry.level === 'warn' ? '⚠️' : '✅';
    // eslint-disable-next-line no-console
    console.log(`${prefix} [SECURITY] ${entry.event}`, details || '');
  }
}
