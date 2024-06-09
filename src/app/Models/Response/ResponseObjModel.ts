import { ResponseObject } from "./ResponseObj";


export class ResponseObjectModel<T> extends ResponseObject {
  model!: T;
}