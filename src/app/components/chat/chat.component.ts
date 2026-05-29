import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { DocumentService } from '../../services/document.service';
import { ChatMessage } from '../../models/chat-message.model';
import { Document } from '../../models/document.model';
import { ChatDocumentSelectorComponent } from './chat-document-selector/chat-document-selector.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatDocumentSelectorComponent],
  template: `
    <div class="chat-container">
      <div class="container">
        <div class="chat-layout">
          <aside class="chat-sidebar">
            <h2>Document Context</h2>
            <p class="sidebar-description">
              Select documents to provide context for your questions
            </p>
            
            <app-chat-document-selector
              [documents]="documents"
              [selectedDocumentIds]="selectedDocumentIds"
              (selectionChange)="onDocumentSelectionChange($event)"
            ></app-chat-document-selector>
            
            <div class="chat-actions">
              <button class="btn btn-outline" (click)="clearChat()">
                Clear Chat
              </button>
            </div>
          </aside>
          
          <main class="chat-main">
            <div class="chat-header">
              <h1>Chat with Your Documents</h1>
              <p>Ask questions about your uploaded documents</p>
            </div>
            
            <div class="chat-messages" #chatMessages>
              <div 
                *ngFor="let message of chatHistory" 
                class="message-container"
                [class.user-message]="message.isUser"
                [class.ai-message]="!message.isUser"
              >
                <div class="message">
                  <div class="message-content">{{ message.content }}</div>
                  <div class="message-meta">{{ message.timestamp | date:'shortTime' }}</div>
                </div>
                
                <div *ngIf="message.documentReferences && message.documentReferences.length > 0" class="message-references">
                  <div class="references-header">Sources:</div>
                  <div *ngFor="let ref of message.documentReferences" class="reference-item">
                    <span class="reference-name">{{ ref.documentName }}</span>
                    <span *ngIf="ref.pageNumber" class="reference-page">Page {{ ref.pageNumber }}</span>
                    <span class="reference-confidence">{{ (ref.confidence * 100).toFixed(0) }}% match</span>
                  </div>
                </div>
              </div>
              
              <div *ngIf="isTyping" class="message-container ai-message">
                <div class="message">
                  <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="chat-input-container">
              <form (submit)="sendMessage()">
                <div class="chat-input-wrapper">
                  <input 
                    type="text" 
                    [(ngModel)]="currentMessage" 
                    name="message"
                    placeholder="Ask a question about your documents..."
                    class="chat-input"
                    [disabled]="isTyping"
                  />
                  <button 
                    type="submit" 
                    class="btn btn-primary send-button"
                    [disabled]="!currentMessage || isTyping"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      min-height: calc(100vh - 140px);
    }
    
    .chat-layout {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: var(--space-4);
      margin: var(--space-3) 0;
    }
    
    .chat-sidebar {
      background-color: var(--surface);
      border-radius: var(--border-radius-lg);
      padding: var(--space-4);
      box-shadow: var(--shadow-md);
      position: sticky;
      top: var(--space-4);
      height: fit-content;
      max-height: calc(100vh - 200px);
      overflow-y: auto;
      border: 1px solid rgba(94, 125, 171, 0.14);
    }
    
    .sidebar-description {
      font-size: 0.95rem;
      color: var(--neutral-600);
      margin-bottom: var(--space-4);
    }
    
    .chat-actions {
      margin-top: var(--space-4);
    }
    
    .chat-main {
      display: flex;
      flex-direction: column;
      background-color: var(--surface);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-md);
      overflow: hidden;
      border: 1px solid rgba(94, 125, 171, 0.14);
    }
    
    .chat-header {
      padding: var(--space-4);
      border-bottom: 1px solid var(--neutral-200);
    }
    
    .chat-header p {
      color: var(--neutral-600);
      margin-bottom: 0;
    }
    
    .chat-messages {
      flex: 1;
      padding: var(--space-4);
      overflow-y: auto;
      max-height: 60vh;
      min-height: 420px;
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      background-color: var(--surface-soft);
    }
    
    .message-container {
      display: flex;
      flex-direction: column;
      max-width: 80%;
    }
    
    .user-message {
      align-self: flex-end;
    }
    
    .ai-message {
      align-self: flex-start;
    }
    
    .message {
      padding: var(--space-3);
      border-radius: var(--border-radius-lg);
      position: relative;
      box-shadow: 0 4px 18px rgba(15, 23, 42, 0.06);
      word-break: break-word;
    }
    
    .user-message .message {
      background-color: var(--primary);
      color: white;
      border-bottom-right-radius: 0.25rem;
    }
    
    .ai-message .message {
      background-color: white;
      color: var(--neutral-800);
      border-bottom-left-radius: 0.25rem;
    }
    
    .message-content {
      margin-bottom: var(--space-2);
      white-space: pre-wrap;
    }
    
    .message-meta {
      font-size: 0.75rem;
      opacity: 0.8;
      text-align: right;
    }
    
    .message-references {
      margin-top: var(--space-2);
      font-size: 0.85rem;
      color: var(--neutral-600);
      padding: var(--space-3);
      background-color: var(--surface-soft);
      border-radius: var(--border-radius-md);
      border-left: 4px solid var(--primary);
    }
    
    .references-header {
      font-weight: 700;
      margin-bottom: var(--space-2);
    }
    
    .reference-item {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
      margin-bottom: var(--space-2);
    }
    
    .reference-name {
      font-weight: 600;
      color: var(--primary);
    }
    
    .reference-page, .reference-confidence {
      color: var(--neutral-500);
    }
    
    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .typing-indicator span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--neutral-500);
      animation: typing 1.4s infinite both;
    }
    
    .typing-indicator span:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .typing-indicator span:nth-child(3) {
      animation-delay: 0.4s;
    }
    
    @keyframes typing {
      0% { transform: scale(1); }
      50% { transform: scale(1.5); }
      100% { transform: scale(1); }
    }
    
    .chat-input-container {
      padding: var(--space-3) var(--space-4);
      border-top: 1px solid var(--neutral-200);
      background-color: white;
    }
    
    .chat-input-wrapper {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
    }
    
    .chat-input {
      flex: 1;
      min-width: 0;
      padding: var(--space-2) var(--space-3);
      border: 1px solid var(--neutral-300);
      border-radius: var(--border-radius-md);
      font-size: 1rem;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    }
    
    .chat-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(0, 120, 212, 0.12);
    }
    
    .send-button {
      padding: var(--space-2) var(--space-3);
      min-width: 110px;
    }
    
    @media (max-width: 768px) {
      .chat-layout {
        grid-template-columns: 1fr;
      }
      
      .chat-sidebar {
        max-height: none;
        position: static;
        margin-bottom: var(--space-3);
      }
      
      .message-container {
        max-width: 90%;
      }
    }
  `]
})
export class ChatComponent implements OnInit, AfterViewChecked {
  chatHistory: ChatMessage[] = [];
  documents: Document[] = [];
  selectedDocumentIds: string[] = [];
  currentMessage = '';
  isTyping = false;
  
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;
  
  constructor(
    private chatService: ChatService,
    private documentService: DocumentService
  ) {}
  
  ngOnInit(): void {
    this.chatService.chatHistory$.subscribe(messages => {
      this.chatHistory = messages;
    });
    
    this.documentService.getDocuments().subscribe(docs => {
      this.documents = docs.filter(doc => doc.status === 'ready');
    });
    
    this.chatService.selectedDocumentIds$.subscribe(ids => {
      this.selectedDocumentIds = ids;
    });
  }
  
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
  
  sendMessage(): void {
    if (!this.currentMessage.trim() || this.isTyping) {
      return;
    }
    
    const message = this.currentMessage;
    this.currentMessage = '';
    this.isTyping = true;
    
    this.chatService.sendMessage(message).subscribe(response => {      
      console.log(JSON.parse(response.answer || '{}').Content[0].Text);
      response.content = JSON.parse(response.answer || '{}').Content[0].Text;
      this.chatService.addMessageToHistory(response);
      this.isTyping = false;
    });
  }
  
  clearChat(): void {
    this.chatService.clearChatHistory();
  }
  
  onDocumentSelectionChange(documentIds: string[]): void {
    this.chatService.setSelectedDocumentIds(documentIds);
  }
  
  private scrollToBottom(): void {
    try {
      this.chatMessagesContainer.nativeElement.scrollTop = 
        this.chatMessagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}