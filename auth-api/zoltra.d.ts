import { NextFunction, Logger, IEnvironmentManager } from "zoltra";
import { JwtPayload } from "jsonwebtoken";

export * from "zoltra";

type ServiceMap = {
  auth: {
    handle(context: IContext, next: NextFunction): Promise<void>;
    signToken(data: any): string;
    verifyToken(token: string): string | JwtPayload;
    decodeToken(token: string): string | JwtPayload | null;
  };
  logger: Logger;
  env: IEnvironmentManager;
};

declare module "zoltra" {
  export interface IContext {
    validatedBody: Record<string, any>;
    user: any;
    service<T extends keyof ServiceMap>(name: T): ServiceMap[T];
  }
}
