// src/app/page.tsx
import ChatInterface from '@/components/chat/ChatInterface';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cascala-gray-900 mb-2">
            Care Transition Assistant
          </h1>
          <p className="text-lg text-cascala-gray-600">
            AI-powered clinical intelligence for better care team actions
          </p>
        </div>
        <ChatInterface />
      </div>
    </div>
  );
}
