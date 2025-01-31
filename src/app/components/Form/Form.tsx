'use client';

import { useState } from 'react';
import Button from '../Button/Button';

interface FormProps {
    onSubmit: (repoUrl: string, branch1: string, branch2: string) => void;
    loading: boolean;
}

export default function Form({ onSubmit, loading }: FormProps) {
    const [repoUrl, setRepoUrl] = useState<string>('');
    const [branch1, setBranch1] = useState<string>('');
    const [branch2, setBranch2] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(repoUrl, branch1, branch2);
    };

    return (
        <div className="bg-white shadow-md rounded-lg text-gray-900 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="repoUrl"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Repository URL
                    </label>
                    <input
                        type="text"
                        id="repoUrl"
                        placeholder="https://github.com/user/repo.git"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="branch1"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Branch 1
                    </label>
                    <input
                        type="text"
                        id="branch1"
                        placeholder="main"
                        value={branch1}
                        onChange={(e) => setBranch1(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="branch2"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Branch 2
                    </label>
                    <input
                        type="text"
                        id="branch2"
                        placeholder="feature-branch"
                        value={branch2}
                        onChange={(e) => setBranch2(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Comparing...' : 'Compare Branches'}
                </Button>
            </form>
        </div>
    );
}