import { Component } from '@angular/core';
import { ReplaceChannelControllerService, WsControllerService } from 'src/app/library/public-api';

@Component({
  selector: 'app-replace-channel-page',
  templateUrl: './replace-channel-page.component.html',
  styleUrl: './replace-channel-page.component.scss'
})
export class ReplaceChannelPageComponent {
  list = [
  ];
  displayedColumns = ['position', 'name', 'id', 'operate'];
  constructor(
    public ReplaceChannelController: ReplaceChannelControllerService,
    public WsController: WsControllerService
  ) {
    setTimeout(() => {
      this.init()
    }, 2000)
  }


  async init() {
    const c = await window.get_all_client();
    this.list = c
    this.list.forEach((e, i) => {
      e.index = i + 1
    });

  }

  async change(e) {
    this.WsController.receiver_client_id = e.id;
    this.ReplaceChannelController.init()
  }

}
