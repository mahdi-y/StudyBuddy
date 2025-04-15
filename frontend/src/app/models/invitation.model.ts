export interface Invitation {
  id: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  type: string;
  inviterUserId: number;
  inviteeUserId: number;
  createdAt: string;
  studyGroup: {
    id: number;
    name?: string; // optional, in case you want to display the name in the UI
  };
}

export interface SendInvitation {
  inviterUserId: number;
  inviteeUserId: number;
  studyGroup: {
    id: number;
  };
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  type?: string;
}
