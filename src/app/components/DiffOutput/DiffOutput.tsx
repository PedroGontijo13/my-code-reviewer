'use client';

interface DiffOutputProps {
    diff: string;
}

export default function DiffOutput({ diff }: DiffOutputProps) {
    return (
        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Diff:</h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-md">
                {diff}
            </pre>
        </div>
    );
}