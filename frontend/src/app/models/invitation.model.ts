export interface Invitation {
    id: number;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    type: string;
    inviterUserId: number;
    inviteeUserId: number;
    createdAt: string;
    studyGroupId: number;
  }
  
  export interface SendInvitation {
    studyGroupId: number;
    inviterUserId: number;
    inviteeUserId: number;
  }