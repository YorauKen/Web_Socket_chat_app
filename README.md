### User Docs
To start with repo, run
```bash
yarn dev
```

To run redis on docker
```bash
docker run -d --name redis-stack-server -p 6379:6379 redis/redis-stack-server:latest 
```
To run different servers with different port nos , navigate into server directory and run on<br/>
**linux/unix** platoforms
```bash
export PORT=9001 && npm start 
```
**on Windows**
```bat
set PORT=9001 && npm start
```
