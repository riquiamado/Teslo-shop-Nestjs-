import {
  WebSocketGateway,
  // MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
// import { CreateMessagesWDto } from './dto/create-messages-w.dto';
// import { UpdateMessagesWDto } from './dto/update-messages-w.dto';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-messages.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authenticacion as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      console.log(error);
      client.disconnect();
      return;
    }
    console.log({ payload });

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectesClients(),
    );
  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectesClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  onMessageForClient(client: Socket, payload: NewMessageDto) {
    // message from server

    //!Emite unicamente al cliente
    //   client.emit('message-from-server', {
    //     fullName: 'Soy Yo',
    //     message: payload.message || 'No message!!',
    //   });
    // }

    //!Emitir a todos menos al cliente
    //   client.broadcast.emit('message-from-server', {
    //     fullName: 'Soy Yo',
    //     message: payload.message || 'No message!!',
    //   });
    // }

    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'No message!!',
    });
  }

  // @SubscribeMessage('createMessagesW')
  // create(@MessageBody() createMessagesWDto: CreateMessagesWDto) {
  //   return this.messagesWsService.create(createMessagesWDto);
  // }

  // @SubscribeMessage('findAllMessagesWs')
  // findAll() {
  //   return this.messagesWsService.findAll();
  // }

  // @SubscribeMessage('findOneMessagesW')
  // findOne(@MessageBody() id: number) {
  //   return this.messagesWsService.findOne(id);
  // }

  // @SubscribeMessage('updateMessagesW')
  // update(@MessageBody() updateMessagesWDto: UpdateMessagesWDto) {
  //   return this.messagesWsService.update(
  //     updateMessagesWDto.id,
  //     updateMessagesWDto,
  //   );
  // }

  // @SubscribeMessage('removeMessagesW')
  // remove(@MessageBody() id: number) {
  //   return this.messagesWsService.remove(id);
  // }
}
