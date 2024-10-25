interface LogEntry {
    eventType: string;
    message: string;
    data?: any;
    timestamp: string;
    correlationId: string;
  }