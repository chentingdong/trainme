import { useUser } from '@clerk/clerk-react';
import Image from 'next/image';
import { FaRegUserCircle } from 'react-icons/fa';
import { BsPersonVcardFill } from 'react-icons/bs';
import ChatOutputWorkout from '@/app/chat/ChatOutputWorkout';
import { cn } from '@/utils/helper';
import { Message } from 'ai';

export function ChatMessageBubble(props: { message: Message; }) {
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
        {props.message.role === 'assistant' && <ChatOutputWorkout {...props} />}
        {props.message.role === 'user' && <div>{props.message.content}</div>}
      </div>
    </div>
  );
}
