export interface CreateBookingInput {
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  message?: string;
  package?: "single" | "pack3" | "pack5" | "pack10" | "unlimited" | "premium";
}
