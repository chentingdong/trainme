import { useState } from "react";
import type { Message } from "ai/react";
import { FaTools, FaChevronDown, FaChevronRight } from 'react-icons/fa';

export function IntermediateStep(props: { message: Message }) {
  const parsedInput = JSON.parse(props.message.content);
  const action = parsedInput.action;
  const observation = parsedInput.observation;
  const [expanded, setExpanded] = useState(false)
  return (
    <div
      className={`ml-0 bg-gray-200 rounded px-4 py-2 max-w-[80%] opacity-85 mb-8 whitespace-pre-wrap flex flex-col cursor-pointer`}
    >
      <div className={`flex items-center w-fullpx-2 py-1 rounded`} onClick={(e) => setExpanded(!expanded)}>
        <span className='mr-2'>
          {expanded ? <FaChevronDown /> : <FaChevronRight />}
        </span>
        <div className='flex-1 text-center h-0 border-b-2 border-slate-400 flex items-center justify-center'>
          <FaTools className='inline-block mr-2 text-yellow-400' />
          <b className='text-sm bg-gray-200 px-2 py-1'>{action?.name}</b>
        </div>
      </div>
      <div className={`overflow-auto max-h-[0px] transition-[max-height] ease-in-out ${expanded ? "max-h-[360px]" : ""}`}>
        <div className={`bg-slate-200 rounded p-4 mt-1 max-w-0 ${expanded ? "max-w-full" : "transition-[max-width] delay-100"}`}>
          <code className={`opacity-0 max-h-[100px] transition ease-in-out delay-150 ${expanded ? "opacity-100" : ""}`}>
            {JSON.stringify(action?.args)}
          </code>
        </div>
        <div className={`bg-slate-200 rounded p-4 mt-1 max-w-0 ${expanded ? "max-w-full" : "transition-[max-width] delay-100"}`}>
          <code className={`opacity-0 max-h-[260px] transition ease-in-out delay-150 ${expanded ? "opacity-100" : ""}`}>{observation}</code>
        </div>
      </div>
    </div>
  );
}