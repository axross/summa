import * as fs from "firebase/firestore";

export type DocumentReference = fs.DocumentReference & {
  new (...args: any[]): fs.DocumentReference;
};

export const DocumentReference = fs.DocumentReference as DocumentReference;

export type FieldValue = fs.FieldValue & {
  new (...args: any[]): fs.FieldValue;
};

export const FieldValue = fs.FieldValue as FieldValue;
