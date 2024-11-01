import { useState } from "react";
import type { Message } from "ai/react";
import { FaTools, FaAngleDown, FaAngleRight } from 'react-icons/fa';
import { cn } from '@/utils/helper';

export function IntermediateStep(props: { message: Message }) {
  const parsedInput = JSON.parse(props.message.content);
  const action = parsedInput.action;
  const observation = parsedInput.observation;
  const [expanded, setExpanded] = useState(false)
  return (
    <div
      className={cn([
        'ml-0 rounded max-w-[80%] opacity-85 mb-8',
        'whitespace-pre-wrap flex flex-col cursor-pointer',
        'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
        expanded ? "max-h-[360px]" : "max-h-[0px]"
      ])}
    >
      <div className={`flex items-center w-fullpx-2 p-1 rounded`} onClick={(e) => setExpanded(!expanded)}>
        <span className='mr-2 flex items-center text-gray-600 dark:text-gray-400'>
          {expanded ? <FaAngleDown /> : <FaAngleRight />}
        </span>
        <div className='flex-1 text-center h-0 border-b-2 border-slate-400 flex items-center justify-center'>
          <div className='px-2 py-1 rounded'>
            <FaTools className='inline-block text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 h-3 w-3 m-1'/>
            <b className='text-sm px-2 bg-gray-200 dark:bg-gray-700'>{action?.name}</b>
          </div>
        </div>
      </div>
      <div className={cn([
        'overflow-auto scroll scrollbar-thumb-gray-400 scrollbar-track-transparent', 
        'transition-[max-height] ease-in-out',
        expanded ? "max-h-[360px]" : "max-h-[0px]"
      ])}>
        <div className={`bg-slate-300 dark:bg-slate-700 rounded p-4 mt-1 max-w-0 ${expanded ? "max-w-full" : "transition-[max-width] delay-100"}`}>
          <code className={`opacity-0 max-h-[100px] transition ease-in-out delay-150 ${expanded ? "opacity-100" : ""}`}>
            {JSON.stringify(action?.args)}
          </code>
        </div>
        <div className={`bg-slate-300 dark:bg-slate-700 rounded p-4 mt-1 max-w-0 ${expanded ? "max-w-full" : "transition-[max-width] delay-100"}`}>
          <code className={`opacity-0 max-h-[260px] transition ease-in-out delay-150 ${expanded ? "opacity-100" : ""}`}>{observation}</code>
        </div>
      </div>
    </div>
  );
}