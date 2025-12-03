import  { sql } from "@/db/client";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await sql`
    SELECT id, title, body, created_at, updated_at
    FROM posts
    ORDER BY created_at DESC
  `;

  return NextResponse.json({ posts });
}


export async function POST(request: Request) {
  const { title, body } = await request.json();

  if (!title || !body) {
    return NextResponse.json(
      { error: "Title and body are required." },
      { status: 400 }
    );
  }

  const [post] = await sql`
    INSERT INTO posts (title, body)
    VALUES (${title}, ${body})
    RETURNING id, title, body, created_at, updated_at
  `;
  
  return NextResponse.json(post, { status: 201 });
}
