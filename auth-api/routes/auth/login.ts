import { defineMiddlewares, IContext, validateBody } from "zoltra";

export const POST = async (context: IContext) => {
  const { username, password } = context.validatedBody;

  if (username === "admin" && password === "pass") {
    const token = context.service("auth").signToken(username);
    return context
      .status(200)
      .json({ message: "Successfully logged in", data: token });
  } else {
    context.status(401).json({ error: "Invalid credentials" });
  }
};

export const middlewares = defineMiddlewares([
  {
    handler: validateBody(["username", "password"]),
  },
]);
