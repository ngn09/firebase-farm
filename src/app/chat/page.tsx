'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Archive, Users, Send } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialUsers: { name: string; status: 'online' | 'offline' }[] = [];

interface Message {
  sender: string;
  text: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState(initialUsers);

  // In a real app, this would be handled by a proper auth and user management system
  useEffect(() => {
    setUsers([{ name: 'Siz', status: 'online' }]);
  }, []);

  const onlineCount = users.filter(user => user.status === 'online').length;

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    setMessages([...messages, { sender: 'Siz', text: newMessage.trim() }]);
    setNewMessage('');
    
    // Simulate a response from another user
    setTimeout(() => {
        const onlineUsers = users.filter(u => u.status === 'online' && u.name !== 'Siz');
        if (onlineUsers.length > 0) {
            const randomUser = onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
            setMessages(prev => [...prev, {sender: randomUser.name, text: "Merhaba, nasılsın?"}])
        }
    }, 1500);

  };

  return (
    <div className="h-full w-full flex flex-col text-foreground">
      <header className="flex-shrink-0 flex items-center justify-between p-4 px-6 border-b">
        <h1 className="text-2xl font-bold">Sohbet</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Archive className="mr-2 h-4 w-4" />
            Arşivi Görüntüle (0)
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{onlineCount} kişi çevrimiçi</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6 p-6">
        <Card className="hidden md:block">
          <CardHeader>
            <CardTitle>Aktif Kullanıcılar</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {users.map((user) => (
                <li key={user.name} className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    {user.status === 'online' && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${user.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  </span>
                  <span>{user.name}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col h-[calc(100vh-120px)]">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Genel Sohbet</CardTitle>
                 <Button variant="ghost" size="sm">
                    <Archive className="mr-2 h-4 w-4" />
                    Sohbeti Arşivle
                </Button>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-6">
                    <div className="space-y-4">
                        {messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                Henüz mesaj bulunmuyor. İlk mesajı gönderin!
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                <div key={index} className={`flex items-start gap-3 ${msg.sender === 'Siz' ? 'justify-end' : ''}`}>
                                    {msg.sender !== 'Siz' && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={`flex flex-col ${msg.sender === 'Siz' ? 'items-end' : 'items-start'}`}>
                                        <p className="text-sm font-semibold mb-1">{msg.sender}</p>
                                        <div className={`p-3 rounded-lg text-sm ${msg.sender === 'Siz' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                            <p>{msg.text}</p>
                                        </div>
                                    </div>
                                    {msg.sender === 'Siz' && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                <Input 
                  placeholder="Bir mesaj yazın..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  autoComplete="off"
                  className="flex-1"
                />
                <Button type="submit" size="icon" aria-label="Gönder">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
        </Card>
      </main>
    </div>
  );
}
