import { Server } from "socket.io";
import Redis from "ioredis";

const pub = new Redis({
	host:'localhost',
	port:6379,
});
const sub = new Redis({
	host:'localhost',
	port:6379,
});

class SocketService {
	private _io:Server
	constructor(){
		console.log("Init Socket Server...")
		this._io = new Server({
			cors:{
				allowedHeaders:['*'],
				origin:'*',
			}
		});
		sub.subscribe('MESSAGES');
	}

	get io(){
		return this._io
	}

	public initListeners(){
		console.log("Init Socket listeners...");
		const io = this.io;
		io.on("connect",(socket) => {
			console.log(`New Socket connected ${socket.id}`);
			socket.on('event:message',async ({message}:{message:string})=>{
				console.log(`New message received : ${message}`);
				// publish this message to redis
				await pub.publish('MESSAGES',JSON.stringify({message}));
			})
		});

		sub.on('message',(channel,message)=>{
			if(channel == 'MESSAGES'){
				console.log('from sub :' ,message);
				io.emit('message',message);
			}
		});

		
	}
	
}

export default SocketService;