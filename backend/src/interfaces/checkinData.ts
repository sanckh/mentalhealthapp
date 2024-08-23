export interface CheckinData {
    mood?: number;
    stress?: number;
    sleep?: number;
    activity?: number;
    date: FirebaseFirestore.Timestamp;
  }