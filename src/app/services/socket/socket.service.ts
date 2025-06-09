// // src/app/services/chat-socket.service.ts
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import io  from 'socket.io-client';
// import type Socket from 'socket.io-client';


// @Injectable({
//   providedIn: 'root'
// })
// export class ChatSocketService {
//   private socket: any = null;

//   // 🔐 Connect using JWT token
//   connect(token: string): void {
//     if (this.socket) {
//       return; // Already connected
//     }

//     this.socket = io('http://localhost:3000', {
//       auth: {
//         token: 'lol'
//       }
//     });

//     this.socket.on('connect', () => {
//       console.log('Socket connected:', this.socket?.id);
//     });

//     this.socket.on('connect_error', (err: any) => {
//       console.error('Socket connection error:', err.message);
//     });
//   }

//   // 🚪 Disconnect socket
//   disconnect(): void {
//     if (this.socket) {
//       this.socket.disconnect();
//       this.socket = null;
//     }
//   }

//   // 🔌 Join a room
//   joinRoom(data: { username: string; room: string }): void {
//     this.socket?.emit('join', data);
//   }

//   // 📤 Send a message
//   sendMessage(message: { room: string; sender: string; text: string }): void {
//     this.socket?.emit('message', message);
//   }

//   // 📥 Receive new messages
//   onMessage(): Observable<any> {
//     return new Observable(observer => {
//       this.socket?.on('message', (msg: any) => observer.next(msg));
//     });
//   }

//   // 📥 User joined notification
//   onUserJoin(): Observable<any> {
//     return new Observable(observer => {
//       this.socket?.on('user-joined', (data: any) => observer.next(data));
//     });
//   }

//   // 📥 User left notification
//   onUserDisconnect(): Observable<any> {
//     return new Observable(observer => {
//       this.socket?.on('user-left', (data: any) => observer.next(data));
//     });
//   }
// }


// src/app/services/chat-socket.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';
import type Socket from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatSocketService {
  private socket: any;

  // 🔐 Connect using JWT token
  connect(token: string, user:string): void {
    if (this.socket) {
      return; // Already connected
    }

    this.socket = io('http://localhost:3000', {
      auth: {
        token: token
      }
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('connect_error', (err: any) => {
      console.error('Socket connection error:', err.message);
    });
  }

  // 🚪 Disconnect socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // 🔌 Join a room
  joinRoom(room: string ): void {
    this.socket?.emit('join', room);
    console.log("send join data to server", room)
  }

  // 📤 Send a message
  sendMessage(message: { room: string; sender: string; text: string }): void {
    this.socket?.emit('chat message', message);
  }

  // 📥 Receive new messages
  onMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket?.on('chat message', (msg: any) => observer.next(msg));
    });
  }

  // 📥 User joined notification
  onUserJoin(): Observable<any> {
    return new Observable(observer => {
      this.socket?.on('user-joined', (data: any) => observer.next(data));
    });
  }

    // 📥 User joined notification
  onHistory(): Observable<any> {
    return new Observable(observer => {
      this.socket?.on('chat history', (data: any) => observer.next(data));
    });
  }

  // 📥 User left notification
  onUserDisconnect(): Observable<any> {
    return new Observable(observer => {
      this.socket?.on('disconnect', (data: any) => observer.next(data));
    });
  }

  // ➕ New login method added here
  login(username: string, password: string): void {
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => {
        if (!res.ok) throw new Error('Login failed');
        return res.json();
      })
      .then(data => {
        alert('Login successful');
        this.connect(data.token, username);
      })
      .catch(err => alert(err.message));
  }
}
