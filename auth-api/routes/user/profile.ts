import { defineMiddlewares, IContext } from "zoltra";

export default async function handler(context: IContext) {
  return context
    .status(200)
    .json({ message: "Welcome to your profile", user: context.user });
}

export const middlewares = defineMiddlewares([
  {
    handler: (context, next) => {
      context.service("auth").handle(context, next);
    },
  },
]);
