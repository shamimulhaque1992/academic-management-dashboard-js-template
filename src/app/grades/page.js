'use client';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import GradeManagement from '@/components/grades/GradeManagement';

export default function GradesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back
        </button>

        <GradeManagement />
      </div>
    </div>
  );
} 