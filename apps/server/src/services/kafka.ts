import {Kafka, Producer} from 'kafkajs';
import fs from 'fs';
import path from 'path';
import primsaClient from './prisma';

// note the kafka from aiven was from free trial , mostly it wont work , we can setup an offline kafka container running and work
const kafka = new Kafka({
	brokers:['kafka-5099942-hiteshyadavm007-yoru.l.aivencloud.com:28162'],
	ssl:{
		ca:[fs.readFileSync(path.resolve("./ca.pem"),"utf-8")],	
	},
	
});

let producer: Producer|null = null;

export async function createProducer (){
	if(producer) return producer;
	const _producer = kafka.producer();
	await _producer.connect();
	return producer = _producer;
}

export async function produceMessage(message:string){
	const producer = await createProducer();
	producer.send({
		messages:[{key:`message-${Date.now()}`,value:message}],
		topic:"MESSAGES",
	});
	return true;
}

export async function startMessageConsumer() {
	console.log("Consumer is Running...")
	const consumer = await kafka.consumer({groupId:"default"});
	await consumer.connect();
	await consumer.subscribe({topic:'MESSAGES',fromBeginning:true});
	await consumer.run({
		autoCommit:true,
		eachMessage:async ({message,pause})=>{
			console.log(`new message received...`);
			if(!message.value) return;
			try {
				await primsaClient.message.create({
					data:{
						text:message.value?.toString(),
					}
				});
			} catch (error) {
				console.log('Something went wrong...');
				pause();
				setTimeout(()=>{
					consumer.resume([{topic:'MESSAGES'}]);
				},60*1000);
			}
			
		}
	})

}

export default kafka;

