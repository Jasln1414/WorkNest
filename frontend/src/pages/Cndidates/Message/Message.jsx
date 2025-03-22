import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { w3cwebsocket as W3CWebSocket } from "websocket";
// import Message from '../../../components/employer/utilities/Message';
import Messages from '../../../Components/Candidates/utilities/Messages';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import Chats from '../utilities/Chats';



function Message() {
  const [message, setMessage] = useState("");
  const baseURL = 'http://127.0.0.1:8000';
  // const baseURL='http://127.0.0.1:8000'
    const token = localStorage.getItem('access')
    const [chatRooms,setChatRooms] = useState([])
    const [chatMessages,setChatMessages] = useState([])
    const [client,setClient] =useState(null)
    const [selectedChat,setSelectedChat] = useState([])
    const [candidateName,setCandidateName] = useState(null)

    const [isOpen, setIsOpen] = useState(false);
    const [chatDrawer, setChatDrawer] = useState(false);

  

    useEffect(()=>{
      const fetchMessageData = async()=>{
        try{
          const response = await axios.get(
            `${baseURL}/chat/chats/`,{
              headers:{
                'Authorization': `Bearer ${token}`,
                'Accept' : 'application/json',
                'Content-Type': 'multipart/form-data'
              }
            }
          )
          // console.log("chats.............................",response.data)
         
    
          if (response.status == 200){
            setChatRooms(response.data)
            setCandidateName(response.data[0].candidate_name)
            setSelectedChat(response.data[0])
            setChatMessages([])
            connectToWebSocket(response.data[0].candidate,response.data[0].employer,response.data[0].candidate)
          }
        }
        catch(error){
          // console.log(error)
        }
      }
      fetchMessageData()
    },[])

    const connectToWebSocket =(candidate_id,employer_id,user_id) =>{
      if(!candidate_id || !employer_id) return ;
      
      const newClint = new W3CWebSocket(
          `${baseURL}/ws/chat/${candidate_id}/${employer_id}/${user_id}`
      );
      setClient(newClint);
      newClint.onopen = () => {
          // console.log("WebSocket Client Connected");

        };
        newClint.onmessage = (message) => {
          // console.log("ayyooooooooooooooooooooooooooooooooooooooooooooooooooooo")
          const data = JSON.parse(message.data);
          setChatMessages((prevMessages) => [...prevMessages, data]);
         
      };
      // console.log("set chat messages from websocket",chatMessages)          
        return () => {
            newClint.close();
            };                
      };
    
      const handleChat = (room) =>{
        setChatMessages([])
        // console.log("roooooooooooooooooooom",room)
        connectToWebSocket(room.candidate,room.employer,room.candidate);
        setSelectedChat(room)
        setChatDrawer(true);
        // console.log("helloooooo")
      }

  const sendMessage = ()=>{
    if (!client || client.readyState !== client.OPEN) {
      // console.error("WebSocket is not open");
      return;
    }
    const sendername = candidateName
    // console.log("SENDER NAME:", sendername);
    const messageData = { message, sendername };
    const messageString = JSON.stringify(messageData);
    // console.log("Sending Message:", messageString);
    client.send(messageString);
    setMessage("");
  }
  return (
    <div className=' w-full h-screen pt-12'>
    <div className="grid min-h-full w-full lg:grid-cols-[280px_1fr] ">
      <div className=" border-r bg-gray-100/40 ">
        <div className="flex h-full max-h-screen flex-col gap-2">
        
          <nav className="flex flex-col gap-1 overflow-auto py-2">
            {chatRooms.map((room,index)=>(
              <div onClick={()=>handleChat(room)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium bg-blue-50 rounded-md cursor-pointer" key={index}>
                <div className="">
                  <img class="w-10 h-10 rounded-full" src={baseURL+room.employer_pic} alt="Rounded avatar"></img>
                </div>
                  <div className="flex-1 truncate font-bold text-gray-500">{room.employer_name}</div>
                               
              </div>
            ))}
            
          </nav>
        </div>
      </div>
    
    <div className='hidden md:block'>
        
       <Chats candidateName={candidateName} selectedChat={selectedChat} chatMessages={chatMessages} setMessage={setMessage} message={message} sendMessage={sendMessage} />
    </div>
    <div className='block md:hidden'>
    <Drawer
          open={chatDrawer}
          onClose={() => setChatDrawer(false)}
          direction='right'
          size={400}
          className='bla bla bla'>
          <div className='bg-gray-100 '>
            <Chats setChatDrawer={setChatDrawer} chatDrawer={chatDrawer} candidateName={candidateName} selectedChat={selectedChat} chatMessages={chatMessages} setMessage={setMessage} message={message} sendMessage={sendMessage} />
          </div>
        </Drawer>
    </div>
  </div>

</div>
  )
}

export default Message