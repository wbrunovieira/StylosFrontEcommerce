import 'next-auth';

declare module 'next-auth' {
  interface User {
    id?: string;
    name?: string | null;
    email?: string;
    picture?: string;
    accessToken?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
