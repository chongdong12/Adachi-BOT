import lodash from "lodash";
import moment from "moment-timezone";
import path from "path";
import { getCache } from "#utils/cache";
import { render } from "#utils/render";
import { getWordByRegex } from "#utils/tools";

const mUrls = {
  // https://bbs.mihoyo.com/ys/article/17715553
  talent: getUrl("/2022/04/01/75833613/75ae11409d213024049312ecf6fa0692_800626047869673548.png"),
  // https://bbs.mihoyo.com/ys/article/17716365
  weapon: getUrl("/2022/03/30/75379475/502ec953d9a1301a23ac26eda0b94471_8012868718086871978.png"),
  // https://bbs.mihoyo.com/ys/article/17715948
  weekly: getUrl("/2022/03/30/75379475/f13d80f2e7f83b667b7f3ffcc36647d2_4239005231258368385.png"),
};

function getUrl(p) {
  return `https://upload-bbs.mihoyo.com/upload/${"/" === p[0] ? p.substring(1) : p}`;
}

async function doMaterial(msg, url) {
  const cacheDir = path.resolve(global.datadir, "image", "material");

  if ([mUrls.talent, mUrls.weapon, mUrls.weekly].includes(url)) {
    const data = await getCache(url, cacheDir, "base64");
    const text = `[CQ:image,type=image,file=base64://${data}]`;
    msg.bot.say(msg.sid, text, msg.type, msg.uid);
    return;
  }

  const materialList = { 1: "MonThu", 2: "TueFri", 3: "WedSat", 4: "MonThu", 5: "TueFri", 6: "WedSat" };
  const dayOfZhou = ["日", "一", "二", "三", "四", "五", "六"].map((c) => `周${c}`);
  const [day] = getWordByRegex(msg.text, ".{2}");
  const serverWeekday = moment().tz("Asia/Shanghai").subtract(4, "hours").weekday();
  const dayOfWeek = dayOfZhou.includes(day) ? dayOfZhou.indexOf(day) : serverWeekday;

  if (undefined === materialList[dayOfWeek]) {
    msg.bot.say(msg.sid, `${day}所有副本都可以刷哦。`, msg.type, msg.uid, true);
    return;
  }

  const character = { type: "character", data: [] };
  const weapon = { type: "weapon", data: [] };
  const items = {
    character: global.info.character.filter((c) => (global.material[materialList[dayOfWeek]] || []).includes(c.name)),
    weapon: global.info.weapon.filter((c) => (global.material[materialList[dayOfWeek]] || []).includes(c.name)),
  };
  const ascensions = { character: [], weapon: [] };

  items.character.forEach((c) => {
    const ascension = lodash.cloneDeep(lodash.take(c.talentMaterials || [], 3));
    let hasIn = false;

    for (let i = 0; i < ascensions.character.length; ++i) {
      if (lodash.isEqual(ascensions.character[i], ascension)) {
        hasIn = true;
        break;
      }
    }

    if (false === hasIn) {
      ascensions.character.push(ascension);
    }
  });

  items.weapon
    .filter((c) => "number" === typeof c.rarity && c.rarity > 2)
    .forEach((c) => {
      const ascension = lodash.cloneDeep(lodash.take(c.ascensionMaterials[0] || [], 4));
      let hasIn = false;

      for (let i = 0; i < ascensions.weapon.length; ++i) {
        if (lodash.isEqual(ascensions.weapon[i], ascension)) {
          hasIn = true;
          break;
        }
      }

      if (false === hasIn) {
        ascensions.weapon.push(ascension);
      }
    });

  ascensions.character.forEach((n) => {
    const record = { ascension: n, list: [] };

    items.character.forEach((c) => {
      const ascension = lodash.take(c.talentMaterials || [], 3);

      if (lodash.isEqual(ascension, n)) {
        record.list.push({ name: c.name, rarity: c.rarity });
      }
    });

    character.data.push(record);
  });

  ascensions.weapon.forEach((n) => {
    const record = { ascension: n, list: [] };

    items.weapon.forEach((c) => {
      const ascension = lodash.take(c.ascensionMaterials[0] || [], 4);

      if (lodash.isEqual(ascension, n)) {
        record.list.push({ name: c.name, rarity: c.rarity });
      }
    });

    weapon.data.push(record);
  });

  render(msg, { day, character, weapon }, "genshin-material");
}

export { doMaterial, mUrls as urls };
