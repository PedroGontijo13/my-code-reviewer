import { NextResponse } from 'next/server';
import simpleGit from 'simple-git';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
    const { repoUrl, branch1, branch2 } = await req.json();

    // Create a temporary directory for the repository
    const tempDir = path.join(process.cwd(), 'temp-repo');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const git = simpleGit(tempDir);

    try {
        // Clone the repository (if not already cloned)
        if (!fs.existsSync(path.join(tempDir, '.git'))) {
            await git.clone(repoUrl, tempDir);
        }

        // Fetch the latest changes
        await git.fetch();

        // Checkout the first branch
        await git.checkout(branch1);

        // Get the diff between the two branches
        const diff = await git.diff([`${branch2}..${branch1}`]);

        // Clean up the temporary directory (optional)
        fs.rmdirSync(tempDir, { recursive: true });

        return NextResponse.json({ diff });
    } catch (error) {
        console.error('Error comparing branches:', error);
        return NextResponse.json(
            { error: 'Failed to compare branches' },
            { status: 500 }
        );
    }
}