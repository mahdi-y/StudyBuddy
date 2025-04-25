export interface StudyGroup {
    id: number;
    name: string;
    description: string;
    ownerUserId: number;
  }
  
  export interface CreateStudyGroup {
    name: string;
    description: string;
    ownerUserId: number;
  }