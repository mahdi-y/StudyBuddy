export interface Invitation {
  id: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  type: string;
  inviterUserId: number;
  inviteeUserId: number;
  inviteeEmail?: string; // 💌 optional, for email sending
  createdAt: string;
  studyGroup: {
    id: number;
    name?: string; // optional, in case you want to display the name in the UI
  };
  username?: string;
}

export interface SendInvitation {
  inviterUserId: number;
  inviteeUserId: number;  // Change this to 'string' to accept email
  inviteeEmail: string;   // Email will be passed here
  studyGroup: {
    id: number;
  };
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  type?: string;
}

