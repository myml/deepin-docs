# DeepinDocs

## 抓取 markdown

### 配置文件

在项目根目录创建配置文件crawler-config.yaml，添加需要抓取的url到文件中。

配置文件示例

```yaml
# crawler-config.yaml
urls:
  - path: packages/packages_zh.md
    url: http://localhost:8000/docs/mirrors/packages_zh.md
```

配置文件格式

```json
{
 "title": "Root", 
 "type": "object",
 "properties": {
  "urls": {
   "type": "array",
   "items":{
    "title": "Items", 
    "type": "object",
    "properties": {
     "path": {
      "type": "string",
     },
     "url": {
      "type": "string",
     }
    }
   }
  }
 }
}
```

### 执行抓取

运行 `node crawler.mjs`, 配置的文件会下载到src/assets目录，并根据配置的path生成routes文件。

## 渲染markdown

使用 `pnpm prerender` 渲染抓取的文件到dist/browser
