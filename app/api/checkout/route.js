export async function POST(request) {
  const pythonApiUrl = process.env.PYTHON_API_URL;

  if (!pythonApiUrl) {
    return Response.json({ ok: false, error: 'PYTHON_API_URL not set.' }, { status: 503 });
  }

  const body = await request.json();

  try {
    const res = await fetch(`${pythonApiUrl}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    return Response.json(
      { ok: false, error: `Could not reach checkout service: ${err.message}` },
      { status: 502 }
    );
  }
}
