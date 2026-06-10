import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { TextBox } from '../../ui/text-box/text-box';
import { Button } from '../../ui/button/button';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, TextBox, Button],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private userService = inject(UserService);

  searchQuery = signal<string>('');

  // Read users list from global user service
  users = this.userService.users;

  // Filtered users list based on query search
  filteredUsers = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const list = this.users();
    if (!query) return list;
    return list.filter(user => user.username.toLowerCase().includes(query));
  });

  latestUser = computed(() => {
    const list = this.users();
    return list.length > 0 ? list[0].username : '';
  });

  resetList(): void {
    if (typeof window !== 'undefined' && typeof confirm !== 'undefined') {
      if (confirm('هل أنت متأكد من مسح جميع السجلات؟')) {
        this.userService.clearUsers();
      }
    }
  }
}
