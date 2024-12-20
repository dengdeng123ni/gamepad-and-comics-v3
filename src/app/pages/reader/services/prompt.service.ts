import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrentService } from './current.service';
import { DataService } from './data.service';
import { NotifyService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  obj = {};


  ooo="";
  constructor(
    public current: CurrentService,
    public data: DataService,
    public Notify:NotifyService,
    private _snackBar: MatSnackBar
  ) {

    current.pageStatu$.subscribe(async (x) => {


      if (document.body.getAttribute('locked_region') != "reader_navbar_bar") {
        // if (x == "page") {
        //   this.obj = {};
        //    const ooo=`${this.data.page_index}_${this.data.pages.length}`;
        //    if(this.ooo==ooo){

        //    }else{
        //     const 页码 = await this.I18n.getTranslatedText('页码')
        //     this.Notify.messageBox(`${页码}: ${this.data.page_index+1} / ${this.data.pages.length}`, null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'center', verticalPosition: 'top', });
        //     this.ooo=ooo;
        //   }

        // }
        // return
      }
      if (!this.obj[x]) this.obj[x] = 0;
      this.obj[x]++;
      Object.keys(this.obj).forEach(x => {
        if (this.obj[x] == 1) {
          if (x == "page_first")   this.Notify.messageBox('第一页', null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'start', verticalPosition: 'top', });
          if (x == "page_last") this.Notify.messageBox('最后一页', null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'end', verticalPosition: 'top', });
          if (x == "chapter_first") this.Notify.messageBox('第一章', null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'start', verticalPosition: 'top', });
          if (x == "chapter_last") this.Notify.messageBox('最终章', null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'end', verticalPosition: 'top', });
          // if (x == "page") this.Notify.messageBox("最终章", null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'end', verticalPosition: 'top', });
          this.obj[x] = 0;
        }
      })
      if (x == "chapter") {
        const obj = this.data.chapters.find(x => x.id == this.data.chapter_id)
        if (obj) this.Notify.messageBox(obj.title, null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'center', verticalPosition: 'top', });
      }

    })
  }

  chapterPrompt(data) {
    this.Notify.messageBox(data, null, { panelClass: "_chapter_prompt", duration: 1000, horizontalPosition: 'center', verticalPosition: 'top', });
  }


  firstPrompt() {

  }
  async observeElementVisibility(element, callback, options) {
    // 定义 IntersectionObserver 的回调函数
    await this.sleep(200)
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (callback && typeof callback === 'function') {
                // 将元素是否可见和元素本身传递给回调函数

                callback(entry.isIntersecting, entry.target);
            }
        });
    };

    // 创建 IntersectionObserver 实例
    const observer = new IntersectionObserver(observerCallback, {
        root: options.root || null,           // 默认为视口
        rootMargin: options.rootMargin || '0px', // 默认为无边距
        threshold: options.threshold || 0.1    // 默认为 10% 可见时触发
    });

    // 开始观察传入的元素
    observer.observe(element);

    // 返回 observer 以便后续可以手动停止观察
    return observer;
}

  sleep = (duration) => {
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    })
  }
}
