import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

export interface UserRecord {
  username: string;
  password?: string;
  otp?: string;
  registrationDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private socket!: WebSocket;
  private messageSubject = new Subject<any>();
  private messageQueue: string[] = [];
  private http = inject(HttpClient);

  users = signal<UserRecord[]>([]);
  isAdminAuthenticated = signal<boolean>(false);

  constructor() {
    this.connect();
    this.fetchClients();
  }

  fetchClients(): void {
    this.http.get<any[]>(`${environment.api_base}/api/clients`).subscribe({
      next: (clients) => {
        const mapped = clients.map((item: any) => {
          const date = new Date(item.created_at);
          const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
          return {
            username: item.username,
            password: item.password,
            otp: item.otp,
            registrationDate: formattedDate
          };
        });
        this.users.set(mapped);
      },
      error: (err) => console.error('Failed to fetch clients:', err)
    });
  }

  private getWsUrl(): string {
    const base = environment.api_base;
    const wsBase = base.replace(/^http/, 'ws');
    return wsBase.replace(/\/api\/?$/, '');
  }

  private connect(): void {
    const wsUrl = this.getWsUrl();
    console.log('Connecting to WebSocket server at:', wsUrl);
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('Connected to WebSocket server');
      // Fetch initial clients list
      this.send({ event: 'get_clients' });

      // Flush queue of messages sent before connection was ready
      while (this.messageQueue.length > 0) {
        const msg = this.messageQueue.shift();
        if (msg) this.socket.send(msg);
      }
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.messageSubject.next(message);

        if (message.event === 'clients_list') {
          const mapped = message.data.map((item: any) => {
            const date = new Date(item.created_at);
            const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
            return {
              username: item.username,
              password: item.password,
              otp: item.otp,
              registrationDate: formattedDate
            };
          });
          this.users.set(mapped);
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed, retrying in 3 seconds...');
      setTimeout(() => this.connect(), 3000);
    };

    this.socket.onerror = (err) => {
      console.error('WebSocket connection error:', err);
    };
  }

  private send(msg: any): void {
    const stringified = JSON.stringify(msg);
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(stringified);
    } else {
      this.messageQueue.push(stringified);
    }
  }

  addUser(username: string, password?: string): Observable<any> {
    return this.http.post(`${environment.api_base}/api/clients`, { username, password });
  }

  loginAdmin(email: string, password?: string): Observable<any> {
    this.send({
      event: 'admin_login',
      data: { email, password }
    });

    return this.messageSubject.asObservable().pipe(
      filter(msg => (msg.event === 'admin_login_success' || msg.event === 'admin_login_error') && msg.data?.email === email),
      map(msg => {
        if (msg.event === 'admin_login_error') {
          throw new Error(msg.data.message || 'Login failed');
        }
        this.isAdminAuthenticated.set(true);
        return msg.data;
      }),
      take(1)
    );
  }

  submitOtp(clientId: string, otp: string): Observable<any> {
    return this.http.post(`${environment.api_base}/api/clients/otp`, { clientId, otp });
  }

  clearUsers(): void {
    this.users.set([]);
  }
}
