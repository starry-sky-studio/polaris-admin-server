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
    client.emit('onMessage')
    console.log(body, 'body')
    const event = 'newMessage'
    return { event, data: body }
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    client.emit('onMessage', '1111')
    return this.server.write('message', body)
  }

  @SubscribeMessage('foo')
  onEvent(@MessageBody() data: unknown): Observable<WsResponse<number>> {
    const event = 'events'
    const response = [1, 2, 3]
    console.log(data, 'data')
    return from(response).pipe(map((data) => ({ event, data })))
  }
}
