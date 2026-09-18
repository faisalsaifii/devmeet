import { NextResponse } from "next/server";

export const runtime = "nodejs";

type CompileRequest = {
	languageId: string;
	sourceCode: string;
	stdin: string;
};

export async function POST(request: Request) {
	let body: CompileRequest;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
	}

	const { languageId, sourceCode, stdin } = body;
	const apiKey = process.env.JUDGE0_API_KEY ?? process.env.NEXT_PUBLIC_API_KEY;

	if (!apiKey) {
		return NextResponse.json(
			{ error: "Compilation is not configured" },
			{ status: 500 }
		);
	}

	const params = new URLSearchParams({
		base64_encoded: "true",
		wait: "true",
		fields: "*",
	});

	try {
		const response = await fetch(
			`https://judge0-ce.p.rapidapi.com/submissions?${params}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-RapidAPI-Key": apiKey,
					"X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
				},
				body: JSON.stringify({
					language_id: languageId,
					source_code: Buffer.from(sourceCode, "utf-8").toString("base64"),
					stdin: Buffer.from(stdin, "utf-8").toString("base64"),
				}),
			}
		);

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json(
				{ error: data.message ?? "Compilation failed" },
				{ status: response.status }
			);
		}

		const stdout = data.stdout
			? Buffer.from(data.stdout, "base64").toString("utf-8")
			: "";

		return NextResponse.json({ stdout });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Compilation failed" },
			{ status: 500 }
		);
	}
}