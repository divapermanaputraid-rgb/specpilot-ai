import React from 'react';
import { InterviewMessage } from '@/lib/api-client';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InterviewThreadProps {
  history: InterviewMessage[];
}

export const InterviewThread: React.FC<InterviewThreadProps> = ({ history }) => {
  return (
    <div className="flex flex-col space-y-6 py-8 px-6">
      <AnimatePresence initial={false}>
        {history.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn(
              "flex flex-col max-w-[85%]",
              message.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
            )}
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center border shadow-sm",
                message.role === 'user' 
                  ? "bg-blue-600 border-blue-700 text-white" 
                  : "bg-zinc-100 border-zinc-200 text-zinc-700"
              )}>
                {message.role === 'user' ? <User size={12} /> : <Bot size={12} />}
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                {message.role === 'user' ? 'You' : 'Pilot'}
              </span>
            </div>
            
            <div className={cn(
              "px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-sm",
              message.role === 'user' 
                ? "bg-blue-600 text-white rounded-tr-none" 
                : "bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-tl-none"
            )}>
              {message.content}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};