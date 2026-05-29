import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <h1>Document AI Chat</h1>
          </div>
          <nav class="navigation">
            <ul class="nav-links">
              <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a></li>
              <li><a routerLink="/chat" routerLinkActive="active">Chat</a></li>
              <li><a routerLink="/documents" routerLinkActive="active">Documents</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(14px);
      box-shadow: var(--shadow-sm);
      position: sticky;
      top: 0;
      z-index: 50;
      border-bottom: 1px solid rgba(229, 234, 239, 0.9);
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-3) 0;
    }
    
    .logo h1 {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
      color: var(--primary);
      letter-spacing: 0.02em;
    }
    
    .nav-links {
      display: flex;
      list-style: none;
      gap: var(--space-4);
      flex-wrap: wrap;
    }
    
    .nav-links a {
      text-decoration: none;
      color: var(--neutral-700);
      font-weight: 600;
      transition: color var(--transition-fast), transform var(--transition-fast);
      padding: var(--space-2) var(--space-2);
      border-radius: var(--border-radius-md);
    }
    
    .nav-links a:hover {
      color: var(--primary);
      transform: translateY(-1px);
    }
    
    .nav-links a.active {
      color: var(--primary);
      background-color: rgba(0, 120, 212, 0.08);
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: var(--space-2);
      }
      
      .nav-links {
        gap: var(--space-3);
        justify-content: center;
      }
    }
  `]
})
export class HeaderComponent {}