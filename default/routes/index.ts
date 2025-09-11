import { IContext } from "zoltra";

// http://localhost:$PORT/ or default:http://localhost:5000
// Zoltra automatically loads process.env variables into the app instance.
// These environment variables are accessible within the app context and handlers.
// Note: Attempting to access process.env.$KEY outside the Zoltra app will return undefined.
export default function handler(context: IContext) {
  return context.json({ message: "Welcome to zoltra!" });
}
