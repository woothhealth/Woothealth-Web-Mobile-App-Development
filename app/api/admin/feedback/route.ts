import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'feedback.json');

async function readData(): Promise<any[]> {
  try {
    const raw = await fs.promises.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    // If file doesn't exist, return empty array
    return [];
  }
}

async function writeData(list: any[]) {
  try {
    await fs.promises.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write feedback data', err);
    throw err;
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search');
    const list = await readData();
    if (search) {
      const filtered = list.filter((f) => String(f.userId) === String(search));
      return NextResponse.json({ data: filtered });
    }
    return NextResponse.json({ data: list });
  } catch (err: any) {
    console.error('GET /api/admin/feedback error', err);
    return new NextResponse(JSON.stringify({ error: 'Failed to read feedback data' }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return new NextResponse(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });

    const { userId, description, type, agentName, feedTimestamp } = body as any;
    if (!userId || !description) {
      return new NextResponse(JSON.stringify({ error: 'Missing userId or description' }), { status: 400 });
    }

    const list = await readData();
    const newItem = {
      id: (typeof crypto !== 'undefined' && (crypto as any).randomUUID ? (crypto as any).randomUUID() : `feed-${Date.now()}-${Math.floor(Math.random() * 1000)}`),
      userId,
      description,
      type: type || 'general',
      agentName: agentName || 'Admin User',
      feedTimestamp: feedTimestamp || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    list.unshift(newItem);
    await writeData(list);

    return NextResponse.json({ data: newItem }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/admin/feedback error', err);
    return new NextResponse(JSON.stringify({ error: 'Failed to create feedback' }), { status: 500 });
  }
}
