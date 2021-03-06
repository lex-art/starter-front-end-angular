import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ConmonService {
  isOpen = new Subject<boolean>();
  showMenu(): void {
    this.isOpen.next(true);
  }
  hideMenu(): void {
    this.isOpen.next(false);
  }
}
