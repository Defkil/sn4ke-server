export interface LoggerToolsInterface {
    trace(msg: string | object): void
    debug(msg: string | object): void
    info(msg: string | object): void
    warn(msg: string | object): void
    error(msg: string | object): void
    fatal(msg: string | object): void
    child(mergingObject: any): LoggerToolsInterface
}
