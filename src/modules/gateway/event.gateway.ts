import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from '@nestjs/websockets'
import { Observable, from, map } from 'rxjs'
import { Server, Socket } from 'socket.io'
@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class EventGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('newMessage') //为了访问已连接的socket实例
  handleMessage(@MessageBody() body: any, @ConnectedSocket() client: Socket): WsResponse<any> {
    //只给单独的客户端发
    client.emit('onMessage')
    console.log(body, 'body')

    const event = 'newMessage'
    return { event, data: body }
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    // 通知其他客户端 chat 事件
    client.broadcast.emit('message', body)
    // this.server.write('message', body)
    // this.server.emit('message', body)
    // this.server.emit('message', 'emit')
    // this.server.send('message', 'send')
    // this.server.serverSideEmit('message', 'serverSideEmit')
    return
  }

  @SubscribeMessage('foo')
  onEvent(@MessageBody() data: unknown): Observable<WsResponse<number>> {
    const event = 'events'
    const response = [1, 2, 3]
    console.log(data, 'data')
    return from(response).pipe(map((data) => ({ event, data })))
  }
}
