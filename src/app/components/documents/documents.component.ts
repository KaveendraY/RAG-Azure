import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Document, DocumentStatus } from '../../models/document.model';
import { DocumentService } from '../../services/document.service';
import { ChatService } from '../../services/chat.service';
import { FileUploadComponent } from './file-upload/file-upload.component';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FileUploadComponent],
  template: `
    <div class="container">
      <section class="documents-header">
        <h1>Your Documents</h1>
        <p>Upload documents to chat with their contents using AI</p>
      </section>
      
      <app-file-upload (fileSelected)="onFileSelected($event)"></app-file-upload>
      
      <section class="documents-list">
        <h2>Uploaded Documents</h2>
        
        <div class="documents-grid">
          <div *ngIf="documents.length === 0" class="no-documents">
            <p>No documents uploaded yet. Upload your first document to get started.</p>
          </div>
          
          <div *ngFor="let doc of documents" class="document-card card" [class.processing]="doc.status !== 'ready'">
            <div class="document-icon">
              <span [ngSwitch]="getDocumentType(doc.type)">
                <span *ngSwitchCase="'pdf'">📄</span>
                <span *ngSwitchCase="'word'">📝</span>
                <span *ngSwitchCase="'excel'">📊</span>
                <span *ngSwitchCase="'powerpoint'">📱</span>
                <span *ngSwitchCase="'image'">🖼️</span>
                <span *ngSwitchDefault>📄</span>
              </span>
            </div>
            
            <div class="document-info">
              <h3 class="document-name">{{ doc.name }}</h3>
              <p class="document-meta">
                {{ formatFileSize(doc.size) }} • 
                {{ doc.uploadDate | date:'medium' }}
              </p>
              
              <div *ngIf="doc.status !== 'ready'" class="document-progress">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="doc.processingProgress || 0"></div>
                </div>
                <span class="progress-text">
                  {{ doc.status === 'uploading' ? 'Uploading' : 'Processing' }}
                  {{ doc.processingProgress || 0 }}%
                </span>
              </div>
            </div>
            
            <div class="document-actions">
              <button *ngIf="doc.status === 'ready'" 
                      class="btn btn-primary" 
                      (click)="chatWithDocument(doc)">
                Chat
              </button>
              
              <button class="btn btn-outline" 
                      [disabled]="doc.status !== 'ready'"
                      (click)="deleteDocument(doc)">
                Delete
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <section class="documents-action">
        <div class="cta-content card">
          <h2>Ready to chat with your documents?</h2>
          <p>Select documents and start asking questions.</p>
          <button class="btn btn-primary" (click)="goToChat()">Go to Chat</button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .documents-header {
      margin-bottom: var(--space-4);
    }
    
    .documents-header h1 {
      font-size: 2rem;
      letter-spacing: -0.03em;
    }
    
    .documents-list {
      margin-top: var(--space-5);
    }
    
    .documents-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--space-4);
      margin-top: var(--space-3);
    }
    
    .no-documents {
      grid-column: 1 / -1;
      text-align: center;
      padding: var(--space-5);
      background-color: var(--surface-soft);
      border-radius: var(--border-radius-lg);
      color: var(--neutral-600);
      border: 1px solid rgba(94, 125, 171, 0.14);
    }
    
    .document-card {
      display: flex;
      flex-direction: column;
      transition: transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal);
      padding: var(--space-4);
      border: 1px solid transparent;
      background-color: var(--surface);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-sm);
    }
    
    .document-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-md);
      border-color: rgba(0, 120, 212, 0.16);
    }
    
    .document-card.processing {
      background-color: var(--surface-soft);
      border: 1px dashed rgba(94, 125, 171, 0.24);
    }
    
    .document-icon {
      width: 60px;
      height: 60px;
      display: grid;
      place-items: center;
      font-size: 1.85rem;
      margin-bottom: var(--space-3);
      color: var(--primary);
      background-color: rgba(0, 120, 212, 0.08);
      border-radius: 18px;
    }
    
    .document-info {
      flex: 1;
    }
    
    .document-name {
      font-size: 1.25rem;
      margin-bottom: var(--space-1);
      word-break: break-word;
      color: var(--neutral-800);
    }
    
    .document-meta {
      color: var(--neutral-600);
      font-size: 0.9rem;
      margin-bottom: var(--space-3);
    }
    
    .document-progress {
      margin: var(--space-2) 0;
    }
    
    .progress-bar {
      height: 10px;
      background-color: var(--neutral-200);
      border-radius: 999px;
      overflow: hidden;
      margin-bottom: var(--space-2);
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary), var(--primary-light));
      transition: width 0.3s ease;
    }
    
    .progress-text {
      font-size: 0.8rem;
      color: var(--neutral-600);
    }
    
    .document-actions {
      display: flex;
      gap: var(--space-2);
      margin-top: auto;
      flex-wrap: wrap;
    }
    
    .documents-action {
      margin: var(--space-5) 0;
    }
    
    .documents-action .cta-content {
      text-align: center;
    }
    
    @media (max-width: 768px) {
      .documents-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DocumentsComponent implements OnInit {
  documents: Document[] = [];
  
  constructor(
    private documentService: DocumentService,
    private chatService: ChatService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.documentService.getDocuments().subscribe(docs => {
      this.documents = docs;
    });
  }
  
  onFileSelected(file: File): void {
    this.documentService.uploadDocument(file).subscribe(doc => {
      // The document is added to the list automatically via the service
    });
  }
  
  chatWithDocument(document: Document): void {
    this.chatService.setSelectedDocumentIds([document.id]);
    this.router.navigate(['/chat']);
  }
  
  deleteDocument(document: Document): void {
    this.documentService.deleteDocument(document.id).subscribe();
  }
  
  goToChat(): void {
    this.router.navigate(['/chat']);
  }
  
  getDocumentType(mimeType: string): string {
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'word';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'excel';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'powerpoint';
    if (mimeType.includes('image')) return 'image';
    return 'other';
  }
  
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}