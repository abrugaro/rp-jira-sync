import * as util from "util";

export class Logger {
  private log: string;

  constructor() {
    this.log = "";
  }

  public clear() {
    this.log = "";
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public info(message: any) {
    this.log = this.log.concat(`\n[INFO] ${util.format(message)}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public debug(message: any) {
    this.log = this.log.concat(`\n[DEBUG] ${util.format(message)}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public error(message: any) {
    this.log = this.log.concat(`\n[ERROR] ${util.format(message)}`);
  }

  public getLogs(): string {
    return this.log;
  }
}
