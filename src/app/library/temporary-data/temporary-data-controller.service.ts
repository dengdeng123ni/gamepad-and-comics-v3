import { Injectable } from '@angular/core';


import { IndexdbControllerService } from '../public-api';
@Injectable({
  providedIn: 'root'
})
export class TemporaryDataControllerService {

  constructor(public webDb: IndexdbControllerService,

  ) {
    window._gh_add_comics = this.add_comics;

  }



  add_comics = async (pages, otpion?: {
    title: string
  }) => {
    const _id = `_${new Date().getTime()}`
    await this.webDb.update("temporary_pages", { id: _id, data: pages })
    await this.webDb.update("temporary_details", {
      id: _id, data: {
        title: otpion.title ?? "",
        cover: pages[0],
        id: _id,
        chapters: [
          {
            title: otpion.title ?? "",
            cover: pages[0],
            id: _id
          }
        ]
      }
    })
    return _id
  }
}
