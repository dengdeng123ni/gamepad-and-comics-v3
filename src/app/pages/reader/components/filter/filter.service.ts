import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FilterComponent } from './filter.component';
import { DataService } from '../../services/data.service';

import { SvgService } from 'src/app/library/svg.service';
import { IndexdbControllerService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  filter = null;
  constructor(
    public _dialog: MatDialog,
    public webDb: IndexdbControllerService,
    public data: DataService,
    public svg:SvgService
  ) {
  }
  public opened: boolean = false;
  init() {
     this.svg.del('page');
     this.get();
  }
  open(config?: MatDialogConfig) {
    if (this.opened == false) {
      const dialogRef = this._dialog.open(FilterComponent, config);
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
  async post(obj,target_id) {
    return await this.webDb.update("data", {
      id: `svg_filter_${this.data.comics_id}`,
      target_id:target_id,
      filter: obj
    })
  }

  async del() {
    return await this.webDb.deleteByKey("data", `svg_filter_${this.data.comics_id}`)
  }


  async get() {

    const res: any = await this.webDb.getByKey("data", `svg_filter_${this.data.comics_id}`)
    if (res) {
      this.svg.add2(res.filter.innerHTML,res.target_id,document.body)
    }
  }
}
