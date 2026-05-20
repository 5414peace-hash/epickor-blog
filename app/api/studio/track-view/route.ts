import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      disabled: true,
      message: 'View tracking writes are disabled to prevent deploy and ISR churn.',
    },
    { status: 410 }
  );
}
