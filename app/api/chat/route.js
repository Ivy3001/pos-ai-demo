export async function POST(request) {
  const pythonApiUrl = process.env.PYTHON_API_URL;

  if (!pythonApiUrl) {
    return Response.json(
      { error: 'PYTHON_API_URL is not set in .env.local — Python service not configured yet.' },
      { status: 503 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  try {
    const res = await fetch(`${pythonApiUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      return Response.json(
        { error: `Python service responded with ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    return Response.json(
      { error: `Could not reach Python service: ${err.message}` },
      { status: 502 }
    );
  }
}
