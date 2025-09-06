import { IContext, NextFn } from "zoltra";
import jwt, { JwtPayload } from "jsonwebtoken";

export class AuthService {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  async handle(context: IContext, next: NextFn) {
    const authHeader = context.headers.authorization;

    if (!authHeader) {
      context.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!authHeader.startsWith("Bearer ")) {
      context.status(400).json({ error: "Use Bearer token" });
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      // ✅ verify token
      const decoded = this.verifyToken(token);

      // attach user info to context
      context.user = decoded;

      await next();
    } catch (error) {
      context.status(403).json({ error: "Invalid token" });
    }
  }

  verifyToken(token: string): string | JwtPayload {
    return jwt.verify(token, this.secret);
  }

  decodeToken(token: string): string | JwtPayload | null {
    try {
      return jwt.decode(token);
    } catch {
      return null;
    }
  }

  signToken(data: any): string {
    return jwt.sign(data, this.secret);
  }
}
