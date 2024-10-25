import { useUser } from '@clerk/clerk-react';
import type { Message } from "ai/react";
import { IoSearch } from "react-icons/io5";
import Image from "next/image";
import { FaRegUserCircle } from "react-icons/fa";
import { FaChalkboardTeacher } from "react-icons/fa";

export function ChatMessageBubble(props: { message: Message, sources: any[]; }) {
  const colorClassName =
    props.message.role === "user" ? "bg-slate-200 text-slate-900" : "bg-gray-200 text-slate-900";
  const alignmentClassName =
    props.message.role === "user" ? "ml-auto" : "mr-auto";
  const { user } = useUser();

  const avatar = props.message.role === "user"
    ? user?.imageUrl ? <Image src={user.imageUrl} className="avatar" alt="User" width={24} height={24} /> : <FaRegUserCircle className="avatar" />
    : <FaChalkboardTeacher className="avatar p-1 bg-orange-400 text-white shadow-md" />;

  return (
    <div
      className={`${alignmentClassName} ${colorClassName} text-sm rounded p-2 max-w-[80%] mb-8 flex`}
    >
      <div className="my-1 mx-3"> {avatar} </div>
      <div className="whitespace-pre-wrap flex flex-col">
        <span>{props.message.content}</span>
        {props.sources && props.sources.length ? <>
          <code className="mt-4 mr-auto bg-slate-600 px-2 py-1 rounded">
            <h2 className="flex items-center gap-2">
              <IoSearch /> Sources:
            </h2>
          </code>
          <code className="mt-1 mr-2 bg-slate-600 px-2 py-1 rounded text-xs">
            {props.sources?.map((source, i) => (
              <div className="mt-2" key={"source:" + i}>
                {i + 1}. &quot;{source.pageContent}&quot;{
                  source.metadata?.loc?.lines !== undefined
                    ? <div><br />Lines {source.metadata?.loc?.lines?.from} to {source.metadata?.loc?.lines?.to}</div>
                    : ""
                }
              </div>
            ))}
          </code>
        </> : ""}
      </div>
    </div>
  );
}
