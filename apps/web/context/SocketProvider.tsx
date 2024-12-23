"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// ? -> optional
interface SocketProviderProps {
  children?: React.ReactNode;
}


interface ISocketContext {
  sendMessage: (msg: string) => any;
  messages:string[];
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg) => {
      console.log("send message ", msg);
      if (socket) {
        socket.emit("event:message", {
          message: msg,
        });
      }
    },
    [socket]
  );

  const onMessageReceived = useCallback((msg:string)=>{
    console.log(`From Server Message Received ${msg}`)
    const {message} = JSON.parse(msg) as {message:string};
    setMessages(prev => [...prev,message]);
  },[])

  useEffect(() => {
    const _socket = io("http://localhost:9000");
    _socket.on('message',onMessageReceived);
    setSocket(_socket);
    return () => {
      _socket.off('message',onMessageReceived);
      _socket.disconnect();
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage,messages }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error("state is undefined");
  return state;
};
