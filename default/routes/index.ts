import { IContext } from "zoltra";

// http://localhost:$PORT/
export default async function handler(context: IContext) {
  return context.json({ message: "Welcome to zoltra" });
}
