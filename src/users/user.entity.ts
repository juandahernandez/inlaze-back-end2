export class User {
  ID: string;
  name: string;
  email: string;
  password: string;
  favoriteMovies: number[];
}

export class UserBody {
  name: string;
  email: string;
  password: string;
}
