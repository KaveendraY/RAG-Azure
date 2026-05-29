import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <p>&copy; 2025 Document AI Chat. Powered by Azure AI Services.</p>
          <div class="footer-links">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Help</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--neutral-900);
      color: var(--neutral-300);
      padding: var(--space-4) 0;
      margin-top: auto;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-3);
    }
    
    .footer-links {
      display: flex;
      gap: var(--space-3);
      flex-wrap: wrap;
    }
    
    .footer-links a {
      color: var(--neutral-300);
      text-decoration: none;
      transition: color var(--transition-fast), transform var(--transition-fast);
    }
    
    .footer-links a:hover {
      color: white;
      transform: translateY(-1px);
    }
    
    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {}