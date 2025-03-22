import React from 'react'
import { IoSend } from "react-icons/io5";
import Messages from '../../../Components/Candidates/utilities/Messages'
import { FaArrowLeft } from "react-icons/fa6";

function Chats({setChatDrawer, chatDrawer, selectedChat, chatMessages, setMessage, message, sendMessage, candidateName}) {
  const baseURL = 'http://127.0.0.1:8000';

  return (
    <div className='mt-12 md:mt-0'>
      <div className="flex flex-col">
        <header className="relative flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <div onClick={()=>setChatDrawer(!chatDrawer)} className='block md:hidden absolute right-2 hover:right-4 transition-transform text-blue-400 hover:text-blue-600'>
            <FaArrowLeft size={27} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8">
                <img className="w-10 h-10 rounded-full" src={baseURL+selectedChat.employer_pic} alt="Rounded avatar" />
              </div>
              <div>
                <div className="font-medium">{selectedChat.employer_name}</div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-2">
          <div className="flex px-5 w-full h-[25rem] md:h-[27rem] flex-col gap-3 overflow-auto">
            {/* Filter out duplicate messages by using a unique key based on content and sender */}
            {chatMessages.map((msg, index) => (
              <div key={`${msg.sendername}-${msg.message}-${index}`}>
                {msg.sendername === candidateName ? (
                  <div className='flex w-full justify-end'>
                    <Messages text={msg.message} send />
                  </div>
                ) : (
                  <div className='flex w-full justify-start'>
                    <Messages text={msg.message} recived />
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
        <div className="border-t bg-white px-4 py-2 dark:bg-gray-950">
          <div className="relative">
            <textarea
              placeholder="Type your message..."
              name="message"
              id="message"
              rows={1}
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              className="min-h-[48px] w-full resize-none rounded-2xl border border-gray-200 bg-white p-3 pr-16 shadow-sm dark:border-gray-800 dark:bg-gray-950"
            />
            <button onClick={sendMessage} type="submit" className="absolute top-3 right-3 w-8 h-8">
              <IoSend size={25} />
              <span className="sr-only">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chats