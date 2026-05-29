import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title slide-up">Chat with Your Documents</h1>
          <p class="hero-subtitle slide-up">Upload any documents and get instant answers using Azure AI</p>
          <div class="hero-actions slide-up">
            <a routerLink="/documents" class="btn btn-primary">Upload Documents</a>
            <a routerLink="/chat" class="btn btn-outline">Start Chatting</a>
          </div>
        </div>
      </div>
    </section>
    
    <section class="features">
      <div class="container">
        <h2 class="section-title text-center">How It Works</h2>
        <div class="feature-grid">
          <div class="feature-card card">
            <div class="feature-icon">📄</div>
            <h3>Upload Documents</h3>
            <p>Upload any type of document: PDFs, Word docs, text files, and more.</p>
          </div>
          <div class="feature-card card">
            <div class="feature-icon">🔍</div>
            <h3>AI Processing</h3>
            <p>Azure AI analyzes and indexes your documents for quick retrieval.</p>
          </div>
          <div class="feature-card card">
            <div class="feature-icon">💬</div>
            <h3>Chat & Get Answers</h3>
            <p>Ask questions in natural language and get accurate answers from your documents.</p>
          </div>
        </div>
      </div>
    </section>
    
    <section class="cta">
      <div class="container">
        <div class="cta-content card">
          <h2>Ready to try it out?</h2>
          <p>Upload your first document and start chatting with your data.</p>
          <a routerLink="/documents" class="btn btn-primary">Get Started</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      padding: var(--space-6) 0;
      background: linear-gradient(135deg, rgba(0, 120, 212, 0.95) 0%, rgba(92, 45, 145, 0.95) 100%);
      color: white;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    
    .hero-content {
      max-width: 760px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }
    
    .hero-title {
      font-size: clamp(2.5rem, 5vw, 3.5rem);
      font-weight: 800;
      margin-bottom: var(--space-3);
      letter-spacing: -0.04em;
    }
    
    .hero-subtitle {
      font-size: 1.15rem;
      margin-bottom: var(--space-4);
      opacity: 0.92;
      max-width: 46rem;
      margin-left: auto;
      margin-right: auto;
    }
    
    .hero-actions {
      display: flex;
      gap: var(--space-3);
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .hero-actions .btn-outline {
      background-color: rgba(255, 255, 255, 0.14);
      border: 2px solid rgba(255, 255, 255, 0.32);
      color: white;
    }
    
    .hero-actions .btn-outline:hover {
      background-color: rgba(255, 255, 255, 0.18);
    }
    
    .features {
      padding: var(--space-6) 0;
    }
    
    .section-title {
      margin-bottom: var(--space-5);
      color: var(--neutral-800);
    }
    
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--space-4);
    }
    
    .feature-card {
      text-align: center;
      transition: transform var(--transition-normal), box-shadow var(--transition-normal);
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid rgba(94, 125, 171, 0.15);
      padding: var(--space-5);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-sm);
    }
    
    .feature-card:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-md);
    }
    
    .feature-icon {
      font-size: 3rem;
      margin-bottom: var(--space-3);
    }
    
    .cta {
      padding: var(--space-5) 0 var(--space-6);
    }
    
    .cta-content {
      text-align: center;
      padding: var(--space-5);
      background: linear-gradient(135deg, rgba(0, 133, 117, 0.95) 0%, rgba(0, 168, 148, 0.95) 100%);
      color: white;
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-md);
    }
    
    .cta-content h2 {
      margin-bottom: var(--space-2);
    }
    
    .cta-content p {
      margin-bottom: var(--space-4);
      opacity: 0.92;
    }
    
    .cta-content .btn-primary {
      background-color: white;
      color: var(--accent);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
    }
    
    .cta-content .btn-primary:hover {
      background-color: #f5f7fb;
    }
    
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }
      
      .hero-subtitle {
        font-size: 1rem;
      }
      
      .hero-actions {
        flex-direction: column;
        align-items: center;
      }
      
      .hero-actions .btn {
        width: 100%;
        max-width: 280px;
      }
    }
  `]
})
export class HomeComponent {}