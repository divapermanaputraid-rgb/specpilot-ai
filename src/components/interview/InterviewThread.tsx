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
    <div className="flex flex-col space-y-8 py-8 px-4">
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
                "w-6 h-6 rounded-full flex items-center justify-center border",
                message.role === 'user' ? "bg-primary border-primary text-primary-foreground" : "bg-muted border-border"
              )}>
                {message.role === 'user' ? <User size={12} /> : <Bot size={12} />}
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                {message.role === 'user' ? 'You' : 'Pilot'}
              </span>
            </div>
            
            <div className={cn(
              "px-5 py-4 rounded-2xl text-sm leading-relaxed",
              message.role === 'user' 
                ? "bg-primary text-primary-foreground rounded-tr-none shadow-md" 
                : "bg-muted/30 border border-border/50 rounded-tl-none"
            )}>
              {message.content}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};