export interface User {
  id: number;
  name: string;
  email: string;
  remainingLessons: number;
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
