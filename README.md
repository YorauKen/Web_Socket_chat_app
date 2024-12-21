### User Docs
To start with repo, run
```
yarn dev
```

To run redis on docker
```
docker run -d --name redis-stack-server -p 6379:6379 redis/redis-stack-server:latest 
```
To run different servers with different port nos , navigate into server directory and run
```
export PORT=9001 && npm start // linux/unix platoforms
set PORT=9001 && npm start // windows platoform

```
