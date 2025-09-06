export * from "zoltra";

declare module "zoltra" {
  export interface IContext {
    validatedBody: Record<string, any>;
    user: any;
  }
}
