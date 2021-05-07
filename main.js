var fs = require("fs");
var async = require("async");
var got = require("got");

const cookie =
  "SUB=_2A25NlxL5DeRhGeBG61QQ8yzLyTqIHXVu5QMxrDV8PUNbmtANLRn_kW9NRj3oYRQeFZ6xwHP0udXjwMP5GPpkSmaP";
async function main() {
  const res = await got(
    "https://weibo.com/ajax/statuses/mymblog?uid=5508712324&page=1&feature=1&count=10",
    {
      headers: { cookie },
    }
  );
  const data = JSON.parse(res.body);
  const ids = data.data.list.filter((w) => w.pic_ids)[0].pic_ids;
  const result = await async.mapLimit(ids, 10, (id, cb) => {
    console.log("begin fetch ", id);
    const write = fs.createWriteStream(`./data/${id}.jpg`);
    const url = `https://wx1.sinaimg.cn/large/${id}.jpg`;
    write.on("finish", () => cb(null, url));
    got.stream(url).pipe(write);
  });
  console.log("all over", result);
}

main();
