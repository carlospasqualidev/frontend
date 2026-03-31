export interface IDateValue {
  date: string | null | undefined;
}

export interface IDateValueWithTimeStamp extends IDateValue {
  hasTimeStamp: boolean;
}

export type IDateFormatterValue =
  | (IDateValue & {
      hasTimeStamp: true;
      showHours: boolean;
    })
  | (IDateValue & {
      hasTimeStamp: false;
      showHours?: never;
    });
