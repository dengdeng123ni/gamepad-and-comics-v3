import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageThemeComponent } from './page-theme.component';
import { GamepadEventService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class PageThemeService {

  filter = null;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService
  ) {
    GamepadEvent.registerAreaEvent('item', {
      B: () => setTimeout(() => this.close())
    })
    GamepadEvent.registerConfig('chapters_list', {
      region: ['item'],
    });


  }
  public opened: boolean = false;

  open(config?: MatDialogConfig) {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(PageThemeComponent, config);
      document.body.setAttribute("locked_region", "chapters_list")
      dialogRef.afterClosed().subscribe(() => {
        if (document.body.getAttribute("locked_region") == "chapters_list" && this.opened) document.body.setAttribute("locked_region",document.body.getAttribute("router"))
        this.opened = false;
      });
      this.opened = true;
    }
  }
  isToggle = () => {
    if (this.opened) this.close()
    else this.open();
  }
  close() {
    this._dialog.closeAll();
  }
}
