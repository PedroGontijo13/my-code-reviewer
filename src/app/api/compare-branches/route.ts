import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST(req: Request) {
    try {
        const { repoUrl, branch1, branch2 } = await req.json();
        console.log("Received Data:", { repoUrl, branch1, branch2 });

        if (!repoUrl || !branch1 || !branch2) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Run Git diff command
        const command = `git diff origin/${branch1} origin/${branch2}`;
        console.log("Executing Command:", command);

        const { stdout, stderr } = await execPromise(command);
        if (stderr) {
            console.error("Git Error:", stderr);
            return NextResponse.json({ error: stderr }, { status: 500 });
        }

        // Send the diff to the external API
        const apiResponse = await fetch('http://localhost:3003/ia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: 'oi' }),
        });

        if (!apiResponse.ok) {
            throw new Error(`API request failed with status ${apiResponse.status}`);
        }

        const apiResponseData = await apiResponse.json();
        console.log("API Response:", apiResponseData);

        return NextResponse.json({ diff: stdout, apiResponse: apiResponseData }, { status: 200 });
    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: 'Failed to compare branches' }, { status: 500 });
    }
}