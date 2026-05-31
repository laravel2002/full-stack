import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-development';

export interface AuthPayload {
  id: number;
  email: string;
  role: string;
}

export function verifyAuth(request: Request): AuthPayload | null {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Không có quyền truy cập (Unauthorized)' },
    { status: 401 }
  );
}
