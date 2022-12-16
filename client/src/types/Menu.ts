export interface Menu {
  id: string;
  name: string;
  isActive: boolean;
  isEditing: boolean;
  days: {
    id: string;
    name: string;
    timeOfDays: {
      id: string;
      name: string;
    }[];
  }[];
}
