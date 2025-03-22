import Item from 'antd/es/list/Item'
import React from 'react'

function Message({text,send}) {
  return (
    <div>
       <div className={` ${send ? "flex justify-start" : "flex justify-end" }  gap-2`}>
              <div className={`rounded-lg ${send ? "bg-green-400" : "bg-blue-400"}  p-3 text-sm dark:bg-gray-800`}>
                <p>
                 {text}
                </p>
              </div>
            </div>
    </div>
  )
}

export default Message