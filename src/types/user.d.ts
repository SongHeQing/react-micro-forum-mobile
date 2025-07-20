export type LoginParams = {
  username: string;
  password: string;
}

export type LoginInfo = {
  id: number;
  username: string;
  email: string;
  token: string;
}

export type RegisterParams = {
  email: string;
  password: string;
}