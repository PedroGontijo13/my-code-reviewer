'use client'; 

import { useState } from 'react';

export default function Home() {
    const [repoUrl, setRepoUrl] = useState<string>('');
    const [branch1, setBranch1] = useState<string>('');
    const [branch2, setBranch2] = useState<string>('');
    const [diff, setDiff] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleCompare = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/compare-branches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repoUrl, branch1, branch2 }),
            });
            const data = await response.json();
            setDiff(data.diff || data.error);
        } catch (error) {
            console.error('Error:', error);
            setDiff('Failed to compare branches');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Code Reviewer</h1>
            <div>
                <input
                    type="text"
                    placeholder="Repository URL"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Branch 1"
                    value={branch1}
                    onChange={(e) => setBranch1(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Branch 2"
                    value={branch2}
                    onChange={(e) => setBranch2(e.target.value)}
                />
            </div>
            <button onClick={handleCompare} disabled={loading}>
                {loading ? 'Comparing...' : 'Compare Branches'}
            </button>
            {diff && (
                <div>
                    <h2>Diff:</h2>
                    <pre>{diff}</pre>
                </div>
            )}
        </div>
    );
}