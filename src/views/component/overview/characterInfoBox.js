// noinspection HtmlRequiredAltAttribute
// noinspection JSUnresolvedVariable

const template = `
<div class="container-overview-infos">
  <div class="container-deco-strip">
    <div class="deco-strip">{{decoStripContent}}</div>
  </div>
  <div class="info-name">{{charInfo.charFullName}}</div>
  <img class="profile-image" :src="charImageUrl" :alt="charImageFilename" />
  <div class="char-infos">
    <p class="info-title"><span>生</span><span>日</span></p>
    <p class="info-content">{{charInfo.birthday}}</p>
    <p class="info-title"><span>神</span><span>之</span><span>眼</span></p>
    <p class="info-content">{{charInfo.vision}}</p>
    <p class="info-title"><span>中</span><span>配</span></p>
    <p class="info-content">{{charInfo.chnCV}}</p>
    <p class="info-title"><span>日</span><span>配</span></p>
    <p class="info-content">{{charInfo.japCV}}</p>
    <p class="info-title"><span>命</span><span>之</span><span>座</span></p>
    <p class="info-content">{{charInfo.constellation}}</p>
    <p class="info-title"><span>稀</span><span>有</span><span>度</span></p>
    <p class="info-content">{{charInfo.rarity}}</p>
    <p class="info-title"><span>基</span><span>础</span><span>攻</span><span>击</span></p>
    <p class="info-content baseATK">{{charInfo.baseATK}}</p>
    <p class="info-title"><span>突</span><span>破</span><span>属</span><span>性</span></p>
    <p class="info-content">{{charInfo.ascensionProp}}</p>
    <p class="info-title"><span>突</span><span>破</span><span>加</span><span>成</span></p>
    <p class="info-content">{{charInfo.ascensionValue}}</p>
  </div>
  <div class="container-introduction">
    <p class="introduction">{{charInfo.introduction}}”</p>
  </div>
  <div class="container-vertical">
    <div class="split-title">- 养成材料 -</div>
    <div class="char-progression-table">
      <p class="info-title table-materials material-title"><span>升</span><span>级</span><span>材</span><span>料</span></p>
      <div class="table-materials all-day-materials">
        <img class="materials" v-for="item in charInfo.levelUpMaterials" :src="getMaterialUrl(item)" :alt="item" />
      </div>
      <p class="info-title table-materials material-title"><span>天</span><span>赋</span><span>材</span><span>料</span></p>
      <div class="table-materials limited-time-materials">
        <img class="materials" v-for="item in charInfo.talentMaterials" :src="getMaterialUrl(item)" :alt="item" />
        <p class="info-weekdays">{{charInfo.weekdays}}</p>
      </div>
      <p class="info-title table-materials material-title"><span>突</span><span>破</span><span>材</span><span>料</span></p>
      <div class="table-materials all-day-materials">
        <img class="materials" v-for="item in charInfo.ascensionMaterials" :src="getMaterialUrl(item)" :alt="item" />
      </div>
    </div>
  </div>
  <div class="container-vertical">
    <div class="split-title">- 命座信息 -</div>
    <div class="constellation-table">
      <div class="info-title constellation-order" v-for="i in 4">{{charInfo.constellationCount[i-1]}}</div>
      <div class="info-content constellations" v-for="i in 4">{{charInfo.constellationEffects[i-1]}}</div>
    </div>
  </div>
</div>`;

// eslint-disable-next-line no-undef
const { defineComponent } = Vue;

export default defineComponent({
  name: "characterInfoBox",
  template: template,
  components: {},
  props: {
    data: Object,
  },
  methods: {
    getMaterialUrl(material) {
      return `http://localhost:9934/resources/Version2/info/image/${material}.png`
    }
  },
  setup(props) {
    const params = props.data;
    const decoStripContent = "PERSONAL INFORMATION - ".repeat(4);
    let charInfo = {};
    const charTitle = params.title + "・" || "";
    charInfo.charFullName = charTitle + params.name;
    const charImageFilename = params.id + ".png";
    const charImageUrl = `http://localhost:9934/resources/Version2/character/${charImageFilename}`;
    charInfo.birthday = params.birthday || "";
    charInfo.vision = params.element || "";
    const cvs = params.cv;
    const chnCV = cvs.split(" | ")[0] || "";
    const japCV = cvs.split(" | ")[1] || "";
    charInfo.chnCV = chnCV;
    charInfo.japCV = japCV;
    // noinspection JSUnresolvedVariable
    charInfo.constellation = params.constellationName || "";
    const rarity = parseInt(params.rarity) || 4;
    charInfo.rarity = "★".repeat(rarity);
    charInfo.baseATK = params.baseATK || "暂无信息";
    charInfo.ascensionProp = params.mainStat || "暂无信息";
    charInfo.ascensionValue = params.mainValue || "暂无信息";
    charInfo.introduction = params.introduce || "暂无信息";
    charInfo.levelUpMaterials = params.levelUpMaterials || [];
    charInfo.talentMaterials = params.talentMaterials || [];
    charInfo.weekdays = params.time || "【】";
    charInfo.ascensionMaterials = params.ascensionMaterials || [];
    charInfo.constellationCount = ["一", "二", "四", "六"];
    charInfo.constellationEffects = params.constellations;

    return {
      decoStripContent,
      charTitle,
      charImageFilename,
      charImageUrl,
      charInfo,
    };
  },
});