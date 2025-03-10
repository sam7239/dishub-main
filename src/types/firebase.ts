export interface ServerTag {
  id: string;
  server_id: string;
  tag: string;
}

export interface Server {
  id: string;
  name: string;
  description: string;
  banner_url: string;
  invite_url: string;
  member_count: number;
  owner_id: string;
  created_at: any; // Firestore Timestamp
  last_bumped?: any; // Firestore Timestamp
  server_tags?: ServerTag[];
}
