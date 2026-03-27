export type ICatchHandler = {
  response?: { data: { message: string }; status: number };
};

export type IThenHandler = {
  data: { message: string };
};
