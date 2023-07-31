let app;

const QUESTION = "QUESTION";
const STATE = "STATE";
const ISSUE = "ISSUE";
const CANDIDATE = "CANDIDATE";
const CYOA = "CYOA";
const BANNER = "BANNER";
const ENDINGS = "ENDINGS";
const MAPPING = "MAPPING";
const BULK = "BULK";

function shouldBeSavedAsNumber(value) {
    return !isNaN(value) && !(value != "0" && Number(value) == 0);
}

async function loadData(dataName) {
    let mode = QUESTION;
    let raw;

    let f = await fetch(`./public/${dataName}`, {mode: "no-cors"});
    raw = await f.text();

    if(raw == null) {
        alert(`Loaded file ./public/${dataName} was null. Not loading.`)
        return;
    }

    Vue.prototype.$TCT = loadDataFromFile(raw);

    let isNew = true;

    if(Vue.prototype.$globalData == null) {
        Vue.prototype.$globalData = Vue.observable({
            mode: mode,
            question: Array.from(Vue.prototype.$TCT.questions.values())[0].pk,
            state: Object.values(Vue.prototype.$TCT.states)[0].pk,
            issue: Object.values(Vue.prototype.$TCT.issues)[0].pk,
            candidate: getListOfCandidates()[0][0],
            filename: "default"
        });
    }
    else {
        isNew = false;
        Vue.prototype.$globalData.question = Array.from(Vue.prototype.$TCT.questions.values())[0].pk;
        Vue.prototype.$globalData.state = Object.values(Vue.prototype.$TCT.states)[0].pk;
        Vue.prototype.$globalData.issue = Object.values(Vue.prototype.$TCT.issues)[0].pk;
        Vue.prototype.$globalData.candidate = getListOfCandidates()[0][0];
        Vue.prototype.$globalData.filename = dataName;
    }

    console.log("Loaded data: ", data);
    console.log("Mode is: ", Vue.prototype.$globalData.mode)

    if(isNew) {
        app = new Vue({el: '#app', data: {}})
    }
}

function getListOfCandidates() {

    if(Object.values(Vue.prototype.$TCT.candidate_issue_score).length == 0) {
        return [[null, null]];
    }

    let arr = Object.values(Vue.prototype.$TCT.candidate_issue_score).map(c => c.fields.candidate);
    arr = Array.from(new Set(arr));
    arr = arr.map((c) => {
        nickname = Vue.prototype.$TCT.getNicknameForCandidate(c);
        if(nickname != "" && nickname != null) {
            nickname = ` (${nickname})`
            return [c, c + nickname];
        }
        
        return [c, c];
    });

    return arr;
}