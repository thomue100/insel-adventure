import { Injectable, signal } from '@angular/core';
import { InventoryItem } from '../models/inventory.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly _items = signal<InventoryItem[]>([]);

  readonly items = this._items.asReadonly();

  addItem(item: InventoryItem): void {
    if (this.hasItem(item.id)) return; // keine Duplikate
    this._items.update((items) => [...items, item]);
  }

  hasItem(itemId: string): boolean {
    return this._items().some((i) => i.id === itemId);
  }
}
