import { Component } from '@angular/core';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-index-toolbar',
  templateUrl: './index-toolbar.component.html',
  styleUrl: './index-toolbar.component.scss'
})
export class IndexToolbarComponent {
  isfullscreen = !!document.fullscreenElement;
  constructor(public menu:MenuService){

  }
  isFullChange() {
    this.isfullscreen = !this.isfullscreen
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    } else {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    }
  }
  on(){
    this.menu.opened=!this.menu.opened;
  }
}
