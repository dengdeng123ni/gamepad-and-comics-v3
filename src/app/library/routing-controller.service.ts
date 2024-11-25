import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
import { DbControllerService, DbEventService } from './public-api';

@Injectable({
  providedIn: 'root'
})
export class RoutingControllerService {

  constructor(
    public webDb: NgxIndexedDBService,
    public router: Router,
    public DbEvent: DbEventService,
    public DbController: DbControllerService

  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        event.url= decodeURIComponent(event.url).split("?")[0];

        let arr = event.url.split("/");
        arr.shift()

        this.add({
          commands: arr.map(x=>decodeURIComponent(x))
        })
      }
    })


  }





  async add(option: {
    commands: Array<string>
  }) {
    let page = null;
    if (option.commands[0] == "query" || option.commands[0] == "search") page = "list"
    else if (option.commands[0] == "detail") page = "detail"
    else page = "reader"

    await firstValueFrom(this.webDb.update('router', {
      id: new Date().getTime(),
      page,
      ...option
    }))
  }
  async UrlToComicsId(url): Promise<any> {
    for (let index = 0; index < Object.keys(this.DbEvent.Events).length; index++) {
      const x = Object.keys(this.DbEvent.Events)[index];
      if (this.DbEvent.Events[x]["UrlToDetailId"]) {
        const id = await this.DbEvent.Events[x]["UrlToDetailId"](url);
        if (id) {
          const detail = await this.DbEvent.Events[x]["getDetail"](id);
          if (detail) {
            return { oright: x, title: detail.title, id: id }
          }
        }
      }
    }
    return null
  }
  async UrlToList(url): Promise<any> {
    for (let index = 0; index < Object.keys(this.DbEvent.Events).length; index++) {
      const x = Object.keys(this.DbEvent.Events)[index];
      if (this.DbEvent.Events[x]["UrlToList"]) {
        const res = await this.DbController["UrlToList"](url, {
          source: x
        });
        if (res && res.length) {
           await firstValueFrom(this.webDb.update('url_to_list', {
            id: window.btoa(encodeURIComponent(url)),
            url: url,
            source:x,
            name: url
          }))
          this.routerList(x, window.btoa(encodeURIComponent(url)))
          await navigator.clipboard.writeText("")
          setTimeout(()=>{
            location.reload();
          },0)
        }
      }
    }
    return null
  }
  async strRouterReader(t) {
    if (t && t.substring(0, 4) == "http") {
      const obj = await this.UrlToComicsId(t);
      if (obj) {
        this.routerReader(obj.oright, obj.id)
      } else {
        // const res = await this.UrlToList(t);
      }
    }
  }
  getClipboardContents = async () => {
    try {
      const navigator = (window as any).__POWERED_BY_WUJIE__ ? window.parent.navigator : window.navigator;
      const clipboardItems = await navigator.clipboard.read();

      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          const blob = await clipboardItem.getType(type);
          const f = await fetch(URL.createObjectURL(blob))
          const t = await f.text()
          if (t.substring(0, 4) == "http") {
            const obj = await this.UrlToComicsId(t);
            if (obj) {
              this.routerReader(obj.oright, obj.id)
              await navigator.clipboard.writeText(obj.title)
            } else {
               await this.UrlToList(t);


            }
          }

        }
      }
    } catch (err) {
      console.error(err.name, err.message);
    }
  }
  async routerReader(source, comics_id) {
    if ("novels" == this.DbEvent.Configs[source].type) {
      const _res: any = await Promise.all([
        this.DbController.getDetail(comics_id, {
          source: source
        }), await firstValueFrom(this.webDb.getByID("last_read_comics", comics_id.toString()))])
      if (_res[1]) {
        this.router.navigate(['/novels', source, comics_id, _res[1].chapter_id])
      } else {
        this.router.navigate(['/novels', source, comics_id, _res[0].chapters[0].id])
      }
    } else {
      const _res: any = await Promise.all([
        this.DbController.getDetail(comics_id, {
          source: source
        }), await firstValueFrom(this.webDb.getByID("last_read_comics", comics_id.toString()))])
      if (_res[1]) {
        this.router.navigate(['/comics', source, comics_id, _res[1].chapter_id])
      } else {
        this.router.navigate(['/comics', source, comics_id, _res[0].chapters[0].id])
      }
    }
  }
  async routerDetail(source, comics_id) {
    if ("novels" == this.DbEvent.Configs[source].type) {
      this.router.navigate(['/novels_detail', source, comics_id]);
    } else {
      this.router.navigate(['/detail', source, comics_id]);
    }

  }
  async routerList(source, id) {
    this.router.navigate(['/query/url_to_list/', source, id]);
  }

  async navigate(page) {

    const list: any = await firstValueFrom(this.webDb.getAll('router'))
    setTimeout(() => {
      list.forEach(x => {
        firstValueFrom(this.webDb.deleteByKey('router', x.id))

      })

    }, 100)

    const arr = list.filter(x => x.page == page)
    const obj = arr.at(-1)

    if (obj) {
      this.router.navigate(obj.commands)
    }
  }
}
