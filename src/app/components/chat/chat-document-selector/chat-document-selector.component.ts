import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Document } from '../../../models/document.model';

@Component({
  selector: 'app-chat-document-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="document-selector">
      <div *ngIf="documents.length === 0" class="no-documents">
        <p>No documents available. Upload documents to enhance your chat experience.</p>
      </div>
      
      <div *ngIf="documents.length > 0" class="documents-list">
        <div class="select-all">
          <label>
            <input 
              type="checkbox" 
              [checked]="areAllSelected()" 
              (change)="toggleSelectAll()" 
            />
            <span>Select All Documents</span>
          </label>
        </div>
        
        <div *ngFor="let document of documents" class="document-item">
          <label>
            <input 
              type="checkbox" 
              [checked]="isSelected(document.id)" 
              (change)="toggleDocument(document.id)"
            />
            <span class="document-name">{{ document.name }}</span>
          </label>
        </div>
      </div>
      
      <div *ngIf="selectedDocumentIds.length > 0" class="selected-info">
        {{ selectedDocumentIds.length }} document(s) selected
      </div>
    </div>
  `,
  styles: [`
    .document-selector {
      margin-top: var(--space-2);
      padding: var(--space-3);
      background-color: var(--surface);
      border-radius: var(--border-radius-lg);
      border: 1px solid rgba(94, 125, 171, 0.12);
      box-shadow: var(--shadow-sm);
    }
    
    .no-documents {
      color: var(--neutral-600);
      background-color: var(--surface-soft);
      padding: var(--space-3);
      border-radius: var(--border-radius-md);
      font-size: 0.95rem;
      text-align: center;
    }
    
    .documents-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
    
    .select-all {
      margin-bottom: var(--space-3);
      padding-bottom: var(--space-3);
      border-bottom: 1px solid rgba(94, 125, 171, 0.12);
    }
    
    .document-item {
      padding: var(--space-3);
      border-radius: var(--border-radius-md);
      transition: background-color var(--transition-fast), transform var(--transition-fast);
    }
    
    .document-item:hover {
      background-color: var(--surface-soft);
      transform: translateY(-1px);
    }
    
    .document-item label, .select-all label {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      cursor: pointer;
    }
    
    .document-name {
      font-size: 0.95rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--neutral-800);
    }
    
    input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: var(--primary);
    }
    
    .selected-info {
      margin-top: var(--space-3);
      font-size: 0.85rem;
      color: var(--primary);
      text-align: center;
      padding: var(--space-2);
      background-color: rgba(0, 120, 212, 0.1);
      border-radius: var(--border-radius-sm);
    }
  `]
})
export class ChatDocumentSelectorComponent {
  @Input() documents: Document[] = [];
  @Input() selectedDocumentIds: string[] = [];
  @Output() selectionChange = new EventEmitter<string[]>();
  
  isSelected(documentId: string): boolean {
    return this.selectedDocumentIds.includes(documentId);
  }
  
  toggleDocument(documentId: string): void {
    let updatedSelection: string[];
    
    if (this.isSelected(documentId)) {
      updatedSelection = this.selectedDocumentIds.filter(id => id !== documentId);
    } else {
      updatedSelection = [...this.selectedDocumentIds, documentId];
    }
    
    this.selectionChange.emit(updatedSelection);
  }
  
  areAllSelected(): boolean {
    return this.documents.length > 0 && this.documents.every(doc => 
      this.selectedDocumentIds.includes(doc.id)
    );
  }
  
  toggleSelectAll(): void {
    if (this.areAllSelected()) {
      // Deselect all
      this.selectionChange.emit([]);
    } else {
      // Select all
      const allDocumentIds = this.documents.map(doc => doc.id);
      this.selectionChange.emit(allDocumentIds);
    }
  }
}