export interface User {
  id: number;
  name: string;
  email: string;
  remaininglessons: number;
}

export interface MailConfigContentTypes {
  htmlName: string;
  title: string;
}

export interface MailConfigTypes {
  [key: string]: MailConfigContentTypes;
}

export type UserMailConfigTypes = {
  username: string;
  password: string;
  host: string;
  port: number;
};

export type MailOptions = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

export type EmailDeliveryResponse = {
  accepted: string[];
  rejected: string[];
  ehlo: string[];
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: {
    from: string;
    to: string[];
  };
  messageId: string;
};

export interface User {
  id: number;
  name: string;
  email: string;
  remaininglessons: number;
  qrCode?: string;
}

export interface SureType {
  open: boolean;
  userId: number | null;
}

export interface NewUserModal {
  id?: number | null;
  type: "new" | "update";
  open: boolean;
  name: string;
  email: string;
  remaininglessons: number | "";
  qrCode?: string;
}

export interface CustomState {
  open: boolean;
  name: string;
  email: string;
  [key: `message${number}`]: string;
}

export interface AllUsersState {
  open: boolean;

  [key: `message${number}`]: string;
}
