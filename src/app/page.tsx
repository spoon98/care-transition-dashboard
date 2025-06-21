// src/app/page.tsx
import ChatInterface from '@/components/chat/ChatInterface';

export default function HomePage() {
  return (
    // Centering the chat interface on the page
    <div className="flex justify-center items-center min-h-[calc(100vh-160px)]"> {/* Adjust height based on header/footer */}
      <div className="w-full max-w-2xl"> {/* Constrain width */}
        <ChatInterface />
      </div>
    </div>
  );
}
