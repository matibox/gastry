export interface Field {
  label: string;
  littleLabel?: string;
}

export interface ValueState {
  email: string;
  username?: string;
  password: string;
  confirmPassword: string;
}
