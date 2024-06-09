import { ResponseObject } from "./ResponseObj";


export class ResponseObjectList<T> extends ResponseObject {
  model!: Array<T>;
}