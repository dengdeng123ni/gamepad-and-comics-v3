import { Injectable } from '@angular/core';
import { ReplaceChannelEventService } from '../public-api';

@Injectable({
  providedIn: 'root'
})
export class WsControllerService {

  send_client_id = null;
  receiver_client_id = null;
  socket;
  _data = {};

  constructor(public ReplaceChannelEvent: ReplaceChannelEventService,) {
    this.ReplaceChannelEvent.register({
      id: 'ws',
      name: '插件'
    }, {
      sendMessage: (e) => {
        const id = Math.random().toString(36).substring(2, 9)
        const jsonString = JSON.stringify({
          send_client_id: e.send_client_id,
          receiver_client_id: e.receiver_client_id,
          type: 'send',
          data: e.data,
          id
        });

        const blob = new Blob([jsonString], { type: "application/json" });
        this.socket.send(blob);
        let bool = true;
        return new Promise((r, j) => {
          const getData = () => {
            setTimeout(() => {
              if (this._data[id]) {
                r(this._data[id])
              } else {
                if (bool) getData()
              }
            }, 33)
          }
          getData()

          setTimeout(() => {
            bool = false;
            r(null)
            j(null)
            this._data[id] = undefined;
          }, 40000)

        })
      },
      getAll: () => {
        const id = Math.random().toString(36).substring(2, 9)
        const jsonString = JSON.stringify({
          type: 'get_all_client',
          id: id
        });
        const blob = new Blob([jsonString], { type: "application/json" });
        this.socket.send(blob);
        let bool = true;
        return new Promise((r, j) => {
          const getData = () => {
            setTimeout(() => {
              if (this._data[id]) {
                console.log(this._data[id]);

                r(this._data[id])
              } else {
                if (bool) getData()
              }
            }, 33)
          }
          getData()

          setTimeout(() => {
            bool = false;
            r(null)
            j(null)
            this._data[id] = undefined;
          }, 40000)

        })
      },
    })

    this.ReplaceChannelEvent.register({
      id: 'http_ws',
      name: '插件'
    }, {
      sendMessage: async e => {
        console.log(e);

        const data = await fetch(`http://localhost:7708/api/ws/send`, {
          method: 'POST', // 指定请求方法为 POST
          headers: {
            'Content-Type': 'application/json', // 指定请求体的格式为 JSON
          },
          body: JSON.stringify(e), // 将数据序列化为 JSON 字符串
        })
        const res = await data.json();
        return res
      },
      getAll: async () => {
        const data = await fetch(`http://localhost:7708/api/ws/getAll`)
        const res = await data.json();
        console.log(res);

        return res
      },
    })
  }


  init = async () => {

    this.socket = new WebSocket("ws://localhost:7703");

    // window.postMessage({
    //   type: "website_proxy_request",
    //   target:'background',
    //   target_website: (init as any).proxy,
    // });




    // 监听连接打开事件
    this.socket.addEventListener('open', async () => {
      const jsonData = { type: "init", name: navigator.userAgent, id: document.body.getAttribute('client_id') };
      const jsonString = JSON.stringify(jsonData);
      const blob = new Blob([jsonString], { type: "application/json" });
      this.socket.send(blob);
    });
    // 监听消息事件
    this.socket.addEventListener('message', async (event) => {
      const text = await new Blob([event.data]).text();
      const c = JSON.parse(text);
      if (c.type == "send") {
        const res = await window._gh_receive_message(c.data)
        let obj = {
          id: c.id,
          receiver_client_id: c.send_client_id,
          send_client_id: c.receiver_client_id,
          type: "receive",
          data: res
        }
        const jsonString = JSON.stringify(obj);
        const blob = new Blob([jsonString], { type: "application/json" });
        this.socket.send(blob);
      } else if (c.type == "http_send") {
        const res = await window._gh_receive_message(c.data)
        let obj = {
          id: c.id,
          receiver_client_id: c.send_client_id,
          send_client_id: c.receiver_client_id,
          type: "http_receive",
          data: res
        }
        const jsonString = JSON.stringify(obj);
        const blob = new Blob([jsonString], { type: "application/json" });
        this.socket.send(blob);
      } else if (c.type == "receive") {
        this._data[c.id] = c.data;
      } else if (c.type == "get_all_client") {
        this._data[c.id] = c.data.filter((item, index, self) =>
          index === self.findIndex((t) => (t.id === item.id))
        );
      }
    });

    // 监听错误事件
    this.socket.addEventListener('error', (error) => {
      console.error('客户端错误', error);
    });

    // 监听连接关闭事件
    this.socket.addEventListener('close', () => {
      console.log('关闭客户端链接');
    });
  }


}
