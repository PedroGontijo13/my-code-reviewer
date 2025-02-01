import { NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";
import fetch from "node-fetch";

export const runtime = "nodejs";

const execPromise = util.promisify(exec);
const HF_API_TOKEN = process.env.HF_API_TOKEN; // ✅ Updated environment variable name
const HF_MODEL = "bigcode/starcoder";

export async function POST(req: Request) {
  try {
    const { repoUrl, branch1, branch2 } = await req.json();
    
    if (!repoUrl || !branch1 || !branch2) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const command = `git diff origin/${branch1} origin/${branch2}`;
    const { stdout, stderr } = await execPromise(command);
    
    if (stderr) {
      console.error("Git Error:", stderr);
      return NextResponse.json({ error: stderr }, { status: 500 });
    }

    const analysis = await analyzeDiffWithHF(stdout);
    return NextResponse.json({ diff: stdout, analysis }, { status: 200 });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Failed to compare branches" },
      { status: 500 }
    );
  }
}

async function analyzeDiffWithHF(diff: string) {
  try {
    const prompt = `Analyze this Git diff and explain changes:\n\n${diff}`;
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 100,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    return data[0]?.generated_text || "No response from AI.";
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return `AI analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`;
  }
}