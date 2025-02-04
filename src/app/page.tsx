'use client';

import { useEffect, useState } from 'react';
import Form from './components/Form/Form';
import DiffOutput from './components/DiffOutput/DiffOutput';

interface ApiResponse {
    response: string;
}

export default function Home() {
    const [diff, setDiff] = useState<string>('');
    const [apiResponse, setApiResponse] = useState<ApiResponse>();
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        console.log(apiResponse)
    }, [apiResponse]);

    const handleCompare = async (
        repoUrl: string,
        branch1: string,
        branch2: string
    ) => {
        setLoading(true);
        try {
            const response = await fetch('/api/compare-branches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repoUrl, branch1, branch2 }),
            });
            const data = await response.json();
            setDiff(data.diff || data.error);
            setApiResponse(data.apiResponse || '');
        } catch (error) {
            console.error('Error:', error);
            setDiff('Failed to compare branches');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
                    Code Reviewer
                </h1>
                <Form onSubmit={handleCompare} loading={loading} />
                {diff && apiResponse && <DiffOutput diff={diff} apiResponse={apiResponse} />}
            </div>
        </div>
    );
}