import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value; 

  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/export/clients`;


  return new NextResponse('Cette route n\'est pas utilisée. Le téléchargement est géré côté client.', { status: 200 });
}