import { SessionOptions } from "iron-session";

export type SessionData = {
  userId: string;
  firstname: string;
  lastname: string;
  isAdmin: boolean;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
};

export const sessionOptions: SessionOptions = {
  password: process.env.AUTH_SECRET!,
  cookieName: "user-session",
  cookieOptions: {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 3,
  },
};
