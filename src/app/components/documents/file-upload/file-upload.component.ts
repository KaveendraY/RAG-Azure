import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="file-upload-container">
      <div 
        class="upload-area" 
        [class.active]="isDragging" 
        (dragover)="onDragOver($event)" 
        (dragleave)="onDragLeave($event)" 
        (drop)="onDrop($event)"
      >
        <input 
          type="file" 
          id="file-upload" 
          class="hidden"
          (change)="onFileChange($event)" 
          accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png"
        />
        
        <div class="upload-content">
          <div class="upload-icon">📤</div>
          <h3>Upload Documents</h3>
          <p>Drag and drop files here or click to browse</p>
          <button class="btn btn-primary" (click)="triggerFileInput()">Select Files</button>
          <p class="file-types">
            Supported formats: PDF, Word, Excel, PowerPoint, TXT, Images
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .file-upload-container {
      width: 100%;
      margin-bottom: var(--space-4);
    }
    
    .upload-area {
      border: 1px solid rgba(94, 125, 171, 0.18);
      border-radius: var(--border-radius-lg);
      padding: var(--space-5);
      text-align: center;
      transition: transform var(--transition-normal), box-shadow var(--transition-normal), background-color var(--transition-normal), border-color var(--transition-normal);
      background-color: var(--surface);
      box-shadow: var(--shadow-sm);
      cursor: pointer;
    }
    
    .upload-area:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
      background-color: var(--surface-soft);
    }
    
    .upload-area.active {
      border-color: var(--primary);
      background-color: rgba(0, 120, 212, 0.08);
    }
    
    .upload-icon {
      font-size: 3rem;
      margin-bottom: var(--space-3);
      color: var(--primary);
    }
    
    .upload-content h3 {
      margin-bottom: var(--space-2);
      font-size: 1.4rem;
      color: var(--neutral-900);
    }
    
    .upload-content p {
      margin-bottom: var(--space-3);
      color: var(--neutral-600);
    }
    
    .file-types {
      font-size: 0.9rem;
      margin-top: var(--space-3);
      color: var(--neutral-500);
    }
    
    .hidden {
      display: none;
    }
  `]
})
export class FileUploadComponent {
  @Output() fileSelected = new EventEmitter<File>();
  
  isDragging = false;
  
  constructor() {}
  
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }
  
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }
  
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    if (event.dataTransfer?.files) {
      const file = event.dataTransfer.files[0];
      if (file) {
        this.processFile(file);
      }
    }
  }
  
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.processFile(file);
      
      // Reset the input so the same file can be uploaded again if needed
      input.value = '';
    }
  }
  
  processFile(file: File): void {
    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'image/jpeg',
      'image/png'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      alert('File type not supported. Please upload a PDF, Word, Excel, PowerPoint, TXT, or image file.');
      return;
    }
    
    // Check file size (limit to 20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size > maxSize) {
      alert('File too large. Maximum file size is 20MB.');
      return;
    }
    
    // Emit the file to the parent component
    this.fileSelected.emit(file);
  }
  
  triggerFileInput(): void {
    document.getElementById('file-upload')?.click();
  }
}