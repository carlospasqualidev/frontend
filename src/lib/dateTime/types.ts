export interface IDateValue {
  date: string | null | undefined;
}

export interface IDateValueWithTimeStamp extends IDateValue {
  hasTimeStamp: boolean;
}
