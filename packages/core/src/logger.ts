export enum LogLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
}

type ConsoleWithLogLevel = Console & {
  [key in LogLevel]: (message?: any, ...optionalParams: any[]) => void;
};

export class Logger {
  private logLevel: LogLevel;

  constructor(logLevel: LogLevel = LogLevel.INFO) {
    this.logLevel = logLevel;
  }

  public setLogLevel(logLevel: LogLevel): void {
    this.logLevel = logLevel;
  }

  public info(message: string): void {
    this.log(LogLevel.INFO, message);
  }

  public warning(message: string): void {
    this.log(LogLevel.WARNING, message);
  }

  public error(message: string, shouldThrow: boolean = false): void {
    this.log(LogLevel.ERROR, message);
    if (shouldThrow) {
      throw new Error(message);
    }
  }

  private log(level: LogLevel, message: string): void {
    if (!this.shouldLog(level)) {
      return;
    }
    this.printToConsole({ level, message, timestamp: new Date() });
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = Object.values(LogLevel);
    const curLevelIndex = levels.indexOf(this.logLevel);
    const logLevelIndex = levels.indexOf(level);
    return logLevelIndex >= curLevelIndex;
  }

  private printToConsole({ level, message, timestamp }: LogEntry): void {
    (console as ConsoleWithLogLevel)[level](message, timestamp.toLocaleString());
  }
}

export const logger = new Logger();
