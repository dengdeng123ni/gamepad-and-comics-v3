import { Injectable, NgZone } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { ContextMenuControllerService } from '../context-menu/context-menu-controller.service';
import { Subject } from 'rxjs';
import { PageEventService } from './page-event.service';
declare const document: any;
// Define an enum to hold the possible directions
// Define a type for the options object passed to scrollIntoView
type ScrollOptions = {
  behavior: "smooth";
  block?: "start" | "end" | "nearest";
  inline?: "start" | "end" | "nearest";
};
@Injectable({
  providedIn: 'root'
})
export class PageControllerService {

  constructor(
    public PageEvent:PageEventService,
    public ContextMenuController: ContextMenuControllerService,
    private zone: NgZone,
    private router: Router
  ) {
    document.body.setAttribute("pattern", "gamepad")
    let config = {
      attributes: true,
      childList: false,
      characterData: false,
      subtree: true,
    };

    let observe = new MutationObserver(() => this.execute());
    observe.observe(document, config);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.current = null;
      }
    })

  }
  runs = [];
  isRunning=false;
  sleep = (duration) => {
    return new Promise(resolve => {
      setTimeout(resolve, duration);
    })
  }
  async execute() {
    // 检查是否符合执行条件
    if (document.body.getAttribute("pattern") !== "gamepad") return;
    // 防止并发执行
    if (this.isRunning) return;
    this.isRunning = true;
    try {
      await this.getNodes();
      await this.sleep(100);
      this.execute();
    } finally {
      // 清理状态，以便下次执行
      this.isRunning = false;
    }
  }
  Y = false;

  private EegionBefore$ = new Subject();
  private nodes = [];
  private list = [];

  current = null;

  setMoveTargetPrevious() {
    const node = this.getCurrentNode();
    const region = node.getAttribute("region");
    let nodePrevious = node.previousElementSibling;
    if (!nodePrevious || nodePrevious && !nodePrevious.getAttribute("region")) {
      const firstNode = document.querySelectorAll(`[region=${region}]`)[0]


      if (node.isSameNode(firstNode)) return
      const { node: leftNode } = this.getMoveTarget("LEFT");
      const { node: upNode } = this.getMoveTarget("UP");
      if (!node.isSameNode(leftNode) && leftNode.getAttribute("region") == region) {
        nodePrevious = leftNode;
      } else if (!node.isSameNode(upNode) && upNode.getAttribute("region") == region) {
        nodePrevious = upNode;
      } else {
        return
      }
    }
    if (!nodePrevious) return
    if (!nodePrevious.getAttribute("region") == region) return
    this.delSelectTarget();
    this.current = this.getCurrentObj(nodePrevious);
    this.setupHoverObserver(nodePrevious)
    nodePrevious.setAttribute("select", "true");
    this.scrollToElement(nodePrevious, "UP");
  }
  setMoveTargetNext() {
    const node = this.getCurrentNode();
    const region = node.getAttribute("region");
    let nodeNext = node.nextElementSibling;
    if (!nodeNext || nodeNext && !nodeNext.getAttribute("region")) {
      const nodes = document.querySelectorAll(`[region=${region}]`)
      const lastNode = nodes[nodes.length - 1]
      if (node.isSameNode(lastNode)) return
      const { node: rightNode } = this.getMoveTarget("RIGHT");
      const { node: downNode } = this.getMoveTarget("DOWN");
      if (!node.isSameNode(rightNode) && rightNode.getAttribute("region") == region) {
        nodeNext = rightNode;
      } else if (!node.isSameNode(downNode) && downNode.getAttribute("region") == region) {
        nodeNext = downNode;
      } else {
        return
      }
    }
    if (!nodeNext) return
    if (!nodeNext.getAttribute("region") == region) return
    this.delSelectTarget();
    this.current = this.getCurrentObj(nodeNext);
    this.setupHoverObserver(nodeNext)
    nodeNext.setAttribute("select", "true");
    this.scrollToElement(nodeNext, "DOWN");
  }
  setMoveTargetFirst() {
    const node = this.getCurrentNode();
    const region = node.getAttribute("region");
    const nodes = document.querySelectorAll(`[region=${region}]`)
    const nodeFirst = nodes[0]
    if (!nodeFirst) return
    if (!nodeFirst.getAttribute("region") == node.getAttribute("region")) return
    this.delSelectTarget();
    this.current = this.getCurrentObj(nodeFirst);
    this.setupHoverObserver(nodeFirst)
    nodeFirst.setAttribute("select", "true");
    this.scrollToElement(nodeFirst, "DOWN");
  }
  setMoveTargetLast() {
    const node = this.getCurrentNode();
    const region = node.getAttribute("region");
    const nodes = document.querySelectorAll(`[region=${region}]`)
    const nodeLast = nodes[nodes.length - 1]
    if (!nodeLast) return
    if (!nodeLast.getAttribute("region") == node.getAttribute("region")) return
    this.delSelectTarget();
    this.current = this.getCurrentObj(nodeLast);
    this.setupHoverObserver(nodeLast)
    nodeLast.setAttribute("select", "true");
    this.scrollToElement(nodeLast, "DOWN");
  }
  // document.querySelector("#section_item_1679231989932").
  getCurrentObj(node) {
    const position = node.getBoundingClientRect();
    return { id: node.getAttribute("_id"), index: 0, select: node.getAttribute("select") == "true", start: node.getAttribute("select") == "true", region: node.getAttribute("region"), position }
  }
  oldRegion = null;

  async getNodes() {
    const region = document.body.getAttribute("locked_region");
    if (!region) {
      this.setDefaultRegion();
      return
    }
    this.nodes = document.querySelectorAll(this.PageEvent.configs[region].queryStr);

    if (this.oldRegion != region) {
      this.oldRegion = region;
      this.EegionBefore$.next(region)
    }
    let list = [];
    let index = 0;
    for (let node of this.nodes) {
      const position = node.getBoundingClientRect();
      list.push({ id: node.getAttribute("_id"), index: index, select: node.getAttribute("select") == "true", start: node.getAttribute("select") == "true", region: node.getAttribute("region"), position });
      index++;
    }
    this.list = list;
  }

  setDefaultRegion() {
    const router = document.body.getAttribute("router");
    if (router) {
      document.body.setAttribute("locked_region", router);
    } else {
      if (this.router.url.split("/")[1] == "") {
        document.body.setAttribute("router", "list")
        document.body.setAttribute("locked_region",document.body.getAttribute("router"))
        return
      }
      if (this.router.url.split("/")[1] == "detail") {
        document.body.setAttribute("router", "detail")
        document.body.setAttribute("locked_region",document.body.getAttribute("router"))
        return
      }
      document.body.setAttribute("router", "reader")
      document.body.setAttribute("locked_region",document.body.getAttribute("router"))
    }
  }

  getCurrentNode = () => {
    let current = null;
    current = this.list.find(x => x.select == true);
    if (!current) current = this.list.find(x => x.start == true);
    if (!current) current = this.list[0];
    if (!current) return
    return this.nodes[current.index]
  };
  getCurrentTarget() {

    this.current = this.list.find(x => x.select == true);
    if (!this.current) this.current = this.list.find(x => x.start == true);
    if (!this.current) this.current = this.list[0];
    if (!this.current) { this.setDefaultRegion(); this.getNodes(); this.getCurrentTarget(); }
  }

  getMoveTarget(direction) {
    const current = this.current;
    const filters = {
      "UP": (x) => x.position.y < current.position.y,
      "DOWN": (x) => x.position.y > current.position.y,
      "LEFT": (x) => x.position.x < current.position.x && current.position.y == x.position.y,
      "RIGHT": (x) => x.position.x > current.position.x && current.position.y == x.position.y,
    }
    let shortests = this.list.filter(x => filters[direction](x) && x.region == current.region);
    if (shortests.length == 0) {
      const filters = {
        "UP": (x) => x.position.y < current.position.y,
        "DOWN": (x) => x.position.y > current.position.y,
        "LEFT": (x) => x.position.x < current.position.x,
        "RIGHT": (x) => x.position.x > current.position.x,
      }
      shortests = this.list.filter(x => filters[direction](x));
    }
    const nearest = shortests.reduce((closest, x) => {
      const dist = Math.hypot(current.position.x - x.position.x, current.position.y - x.position.y);
      return dist < closest.dist ? { node: x, dist: dist } : closest;
    }, { node: null, dist: Infinity }).node;
    const i = nearest ? nearest.index : current.index; //如果没有找到最近的节点，则使用最近的索引或当前索引
    return {
      current: this.list[i], node: this.nodes[i]
    }
  }
  getMoveTargetOther(direction) {
    const current = this.current;
    let shortests = [];
    if (shortests.length == 0) {
      const filters = {
        "UP": (x) => x.position.y < current.position.y && x.region != current.region,
        "DOWN": (x) => x.position.y > current.position.y && x.region != current.region,
        "LEFT": (x) => x.position.x < current.position.x && x.region != current.region,
        "RIGHT": (x) => x.position.x > current.position.x && x.region != current.region,
      }
      shortests = this.list.filter(x => filters[direction](x));
    }
    const nearest = shortests.reduce((closest, x) => {
      const dist = Math.hypot(current.position.x - x.position.x, current.position.y - x.position.y);
      return dist < closest.dist ? { node: x, dist: dist } : closest;
    }, { node: null, dist: Infinity }).node;
    const i = nearest ? nearest.index : current.index; //如果没有找到最近的节点，则使用最近的索引或当前索引
    return {
      current: this.list[i], node: this.nodes[i]
    }
  }

  delSelectTarget() {
    this.list.filter(x => x.select == true).forEach(x => this.nodes[x.index].removeAttribute("select"));
  }
  setCurrentTarget(direction: string) {
    this.delSelectTarget();
    const { current, node } = this.getMoveTarget(direction);
    this.current = current;
    this.setupHoverObserver(node)
    node.setAttribute("select", "true");
    this.scrollToElement(node, (direction as any));
  }
  setCurrentRegionTarget(direction: string) {
    const { current, node } = this.getMoveTarget(direction);
    if (current.region == this.current.region) {
      this.delSelectTarget();
      this.current = current;
      this.setupHoverObserver(node)
      node.setAttribute("select", "true");
      this.scrollToElement(node, (direction as any));
    }
  }
  setOtherRegionTarget(direction: string) {
    const { current, node } = this.getMoveTargetOther(direction);
    this.delSelectTarget();
    this.current = current;
    this.setupHoverObserver(node)
    node.setAttribute("select", "true");
    this.scrollToElement(node, (direction as any));
  }
  setupHoverObserver(node) {
    const config = { attributes: true, childList: false, characterData: false, subtree: false };
    let isHovering = false;
    const observe = new MutationObserver((mutations) => {
      const { target } = mutations[0];
      if (node.getAttribute("select") === "true") {
        if (!this.current || this.current && !this.current.region) return
      } else {
        if (!this.current || this.current && !this.current.region) return
      }
    });
    observe.observe(node, config);
  }

  setCurrentTargetId(id, isMove = true) {
    this.delSelectTarget();
    let i = this.list.findIndex(x => x.id == id)
    if (i > -1) {
      const node = this.nodes[i];
      this.current = this.list[i];
      this.setupHoverObserver(node)
      node.setAttribute("select", "true");

      if (isMove) this.scrollToElement(node, "UP");
    }
  }

  scrollToElement = (element: any, direction: string) => {
    let observer = new IntersectionObserver(
      changes => {
        changes.forEach(x => {
          if (x.intersectionRatio != 1) {
            const funs = {
              "UP": () => element.scrollIntoView({ behavior: "smooth", block: "start" }),
              "LEFT": () => element.scrollIntoView({ behavior: "smooth", block: "start" }),
              "RIGHT": () => element.scrollIntoView({ behavior: "smooth", block: "end" }),
              "DOWN": () => element.scrollIntoView({ behavior: "smooth", block: "end" })
            }
            funs[direction]();

          }
          observer.unobserve(element);
        });
      }
    );
    observer.observe(element);
  }

  leftKey = () => {
    const node = this.nodes[this.current.index];
    const type = node.getAttribute("type")
    if (type == 'chip' || type == 'slide') {
      node.querySelector("button").click();
    } else if (type == 'radio') {
      node.querySelector("input").click();
    } else if (type == 'checkbox') {
      node.querySelector("[type=checkbox]").click();
    } else {
      node.click();
    }
  }
  rightKey() {
    const index = this.current.index;
    const currentPosition = this.nodes[index].getBoundingClientRect();
    let x = parseInt(currentPosition.x + currentPosition.width * 0.7)
    let y = parseInt(currentPosition.y + currentPosition.height * 0.7)
    this.ContextMenuController.openContextMenu(this.nodes[index], x, y)
  }

  getAngle = (x, y): number => {
    x = parseFloat(x);
    y = parseFloat(y);
    var a = Math.atan2(y, x);
    var ret = a * 180 / Math.PI; //弧度转角度，方便调试
    if (ret > 360) {
      ret -= 360;
    }
    if (ret < 0) {
      ret += 360;
    }
    ret += 90;
    if (ret > 360) {
      ret -= 360
    }
    return ret;
  }
}
