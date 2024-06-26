import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class I18nService {

  constructor() {
  }

  config = {
    "edit": "编辑",
    "upload": "上传",
    "select_all": "全选",
    "delete": "删除",
    "cancel_edit": "取消编辑",
    "export": "导出",
    "change_page_matching": "更改跨页匹配",
    "first_page_cover": "第一页封面",
    "back": "返回",
    "insert_blank_page": "插入空白页",
    "all_chapters": "全部章节",
    "reading_mode": "阅读模式",
    "previous_chapter": "上一章",
    "next_chapter": "下一章",
    "toolbar": "工具栏",
    "thumbnail": "缩略图",
    "settings": "设置",
    "full_screen": "全屏",
    "export_ppt": "导出PPT",
    "export_pdf": "导出PDF",
    "export_image": "导出图片",
    "comics": "漫画",
    "all": "全部",
    "chapter_list": "章节列表",
    "continue": "继续",
    "chosen": "已选择",
    "about_the_software": "关于软件",
    "home_page": "首页",
    "turning_direction": "翻页方向",
    "page_order": "页面顺序",
    "ordinary": "普通",
    "japanese_manga": "日漫",
    "from_left_to_right": "从左往右",
    "from_top_to_bottom": "从上往下",
    "from_right_to_left": "从右往左",
    "double_page": "双页",
    "up_and_down": "上下",
    "left_and_right": "左右",
    "single_page": "单页",
    "hide_cursor": "隐藏游标",
    "show_cursor": "显示游标",
    "close_the_gamepad": "关闭手柄",
    "sliding_direction": "滑动方向",
    "gamepad_and_comics": "手柄与漫画",
    "sponsored_author": "赞助作者",
    "insert_page": "插页",
    "before": "前",
    "after": "后",
    "images": "图片",
    "comics_to_be_uploaded": "待上传漫画",
    "compress_images": "压缩图片",
    "add_to": "添加",
    "first_chapter": "第一章",
    "last_chapter": "最终章",
    "first_page": "第一页",
    "last_page": "最后一页",
    "rotation": "旋转",
    "merge_page": "合页",
    "separate_page": "分页",
    "reading_time": "阅读时间",
    "style": "风格",
    "right_angle": "直角",
    "rounded_corners": "圆角",
    "large": "大",
    "small": "小",
    "middle": "中",
    "yes": "是",
    "no": "否",
    "close":"关闭",
    "sound":"音效",
    "open":"打开",
    "automatic_page_turning":"自动翻页",
    "reset_reading_progress":"重置阅读进度",
    "reset":"重置",
  }

  // languages = [ "ru", "de", "pt", "fr", "es", "ja", "ko", "it", "tr", "hu"];
  // aaa=[]

  // download(filename, text) {
  //   var element = document.createElement('a');
  //   element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  //   element.setAttribute('download', filename);

  //   element.style.display = 'none';
  //   document.body.appendChild(element);

  //   element.click();

  //   document.body.removeChild(element);
  // }

  // const name= this.translate.instant('unnamed_collection');
}


