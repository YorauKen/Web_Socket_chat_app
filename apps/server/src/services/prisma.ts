import { PrismaClient } from "@prisma/client";

const primsaClient = new PrismaClient({
	log:['query'],

});

export default primsaClient;