import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  isOpen = signal<boolean>(false);

  toggleMenu(): void {
    this.isOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isOpen.set(false);
  }
}
