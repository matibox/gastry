export interface Menu {
  id: string;
  name: string;
  isActive: boolean;
  isEditing: boolean;
  days: Day[];
}

export interface Day {
  id: string;
  name: string;
  isActive: boolean;
  timeOfDays: TimeOfDay[];
}

export interface TimeOfDay {
  id: string;
  name: string;
  recipe?: {
    id: string;
    title: string;
  };
}
