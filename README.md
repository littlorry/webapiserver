# webapiserver
利用Node.js快速创建出一个灵活的WebAPI服务器

## 主体思路
利用Node.js的动态加载特性，约定了一个放置Api程序文件的路径和命名方法，当站点被访问时将根据约定的方式进行处理程序的定位。

~~~
api
	|--xxx
	|	|--controllers(**控制器**)
	|	|--services(**业务组件**)
	|	|--modules(**业务模型**)
	|	|--index.js	
	|--yyy
	|--zzz
~~~

## 查看注册报告
通过地址 *http://xxx.xxx.xxx/info* 可以查看到注册接口的报告

## 关键依赖部分
* express
* co
