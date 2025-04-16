export interface Ressource {
  idResource?: number;
  title: string;
  fileUrl: string;
  uploadedAt?: string;
  updatedAt?: string;
  type: string;
  description: string;
  category: { idCategory: number };
  user?: { idUser: number };
  group?: { idGroup: number };
}
