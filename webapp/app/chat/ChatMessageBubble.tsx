import { useUser } from '@clerk/clerk-react';
import Image from 'next/image';
import { FaRegUserCircle } from 'react-icons/fa';
import { BsPersonVcardFill } from 'react-icons/bs';
import { cn } from '@/utils/helper';
import { Message } from 'ai';
import ChatOutputWorkout from '@/app/chat/ChatOutputWorkout';
import Debug from '@/app/components/Debug';
interface ChatMessageBubbleProps {
  message: Message;
  outputSchema?: unknown;
  sources?: string[];  
}

export function ChatMessageBubble(props: ChatMessageBubbleProps) {
  const colorClassName =
    props.message.role === 'user'
      ? 'text-slate-900 bg-slate-300 dark:bg-slate-800 dark:text-slate-100'
      : 'text-slate-900 bg-gray-100 dark:bg-gray-800 dark:text-slate-100';
  const alignmentClassName =
    props.message.role === 'user' ? 'ml-auto' : 'mr-auto';
  const { user } = useUser();

  const avatar =
    props.message.role === 'user' ? (
      user?.imageUrl ? (
        <Image
          src={user.imageUrl}
          className='avatar'
          alt='User'
          width={24}
          height={24}
        />
      ) : (
        <FaRegUserCircle className='avatar' />
      )
    ) : (
      <BsPersonVcardFill className='avatar text-yellow-400' />
    );

  return (
    <div
      className={cn([
        alignmentClassName,
        colorClassName,
        'shadow-md text-sm rounded p-2 px-3 max-w-[80%] mb-8 flex',
      ])}
    >
      <div className='ml-1 mr-3 mt-1'> {avatar} </div>
      <div className='whitespace-pre-wrap flex flex-col'>
        {props.message.content.includes('workout') ? ( 
          <ChatOutputWorkout message={props.message} />
        ) : (
          <span>{props.message.content}</span>
        )}
      </div>
      {props.sources && props.sources.length ? <>
        <code className="mt-4 mr-auto bg-slate-600 px-2 py-1 rounded">
          <h2>
            🔍 Sources:
          </h2>
        </code>
        <code className="mt-1 mr-2 bg-slate-600 px-2 py-1 rounded text-xs">
          {props.sources?.map((source, i) => (
            <div className="mt-2" key={"source:" + i}>
              {i + 1}. &quot;{source}&quot;{
                source.metadata?.loc?.lines !== undefined
                  ? <div><br />Lines {source.metadata?.loc?.lines?.from} to {source.metadata?.loc?.lines?.to}</div>
                  : ""
              }
            </div>
          ))}
        </code>
      </> : ""}
    </div>
  );
}
