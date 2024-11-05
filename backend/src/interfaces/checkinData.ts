export interface CheckinData {
    mood?: number;
    stress?: number;
    sleep?: number;
    activity?: number;
    timestamp: FirebaseFirestore.Timestamp;
  }