export class Ressource {
  idResource: number = 0;
  title: string = '';
  fileUrl: string = '';
  uploadedAt: string = '';  // or Date if you want to handle it as a Date object
  type: string = '';
  updatedAt: string = '';
  description: string = '';
  category: any = {};  // If you expect an object, you can initialize it like this
  user: any = {};  // If you expect an object, you can initialize it like this
  group: any = {};  // If you expect an object, you can initialize it like this

  constructor() {}
}
