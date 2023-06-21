Vue.component('question-picker', {

    template: `
    <div class="mx-auto p-6">

    <label for="questionPicker">Questions <span class="text-gray-700 italic">({{numberOfQuestions}})</span>:</label><br>

    <select @click="onClick" @change="onChange($event)" name="questionPicker" id="questionPicker">
        <option v-for="question in questions" :value="question.pk" :key="question.pk" :selected="currentQuestion == question.pk">{{question.pk}} - {{questionDescription(question)}}</option>
    </select><br>

    <button class="bg-green-500 text-white p-2 my-2 rounded hover:bg-green-600" v-on:click="addQuestion()">Add Question</button>

    <p class="text-sm text-gray-700 italic">WARNING: When adding and deleting questions, remember that your code 1 needs to have the same number of questions as in your code 2!</p>

    </div>
    `,

    methods: {

        addQuestion: function() {
            const newPk =  Vue.prototype.$TCT.getNewPk();

            let question = {
                "model": "campaign_trail.question",
                "pk": newPk,
                "fields": {
                    "priority": 0,
                    "description": "put description here",
                    "likelihood": 1.0
                }
            }

            Vue.prototype.$TCT.questions.set(newPk, question);
            
            const temp = Vue.prototype.$globalData.filename;
            Vue.prototype.$globalData.filename = "";
            Vue.prototype.$globalData.filename = temp;

            Vue.prototype.$globalData.mode = QUESTION;
            Vue.prototype.$globalData.question = newPk;
        },

        questionDescription:function(question) {
            return question.fields.description.slice(0,33) + "...";
        },

        onChange:function(evt) {
            Vue.prototype.$globalData.mode = QUESTION;
            Vue.prototype.$globalData.question = evt.target.value;
        },

        onClick:function(evt) {
            if(Vue.prototype.$globalData.mode != QUESTION) {
                Vue.prototype.$globalData.mode = QUESTION;
            }
        }
    },

    computed: {
        questions: function () {
          let a = [Vue.prototype.$globalData.filename];
          return Array.from(Vue.prototype.$TCT.questions.values());
        },

        currentQuestion: function() {
            return Vue.prototype.$globalData.question;
        },

        numberOfQuestions() {
            return this.questions.length;
        }
    }
})

Vue.component('state-picker', {

    template: `
    <div class="mx-auto p-6">

    <label for="statePicker">States:</label><br>

    <select @click="onClick" @change="onChange($event)" name="statePicker" id="statePicker">
        <option v-for="state in states" :value="state.pk" :key="state.pk">{{state.pk}} - {{state.fields.abbr}}</option>
    </select>

    </div>
    `,

    methods: {
        onChange:function(evt) {
            Vue.prototype.$globalData.mode = STATE;
            Vue.prototype.$globalData.state = evt.target.value;
        },

        onClick:function(evt) {
            if(Vue.prototype.$globalData.mode != STATE) {
                Vue.prototype.$globalData.mode = STATE;
            }
        }
    },

    computed: {
        states: function () {
          let a = [Vue.prototype.$globalData.filename];
          return Object.values(Vue.prototype.$TCT.states);
        }
    }
})

Vue.component('issue-picker', {

    template: `
    <div class="mx-auto p-6">

    <label for="issuePicker">Issues:</label><br>

    <select @click="onClick" @change="onChange($event)" name="issuePicker" id="issuePicker">
        <option v-for="issue in issues" :value="issue.pk" :key="issue.pk">{{issue.pk}} - {{issue.fields.name}}</option>
    </select>

    </div>
    `,

    methods: {

        onChange:function(evt) {
            Vue.prototype.$globalData.mode = ISSUE;
            Vue.prototype.$globalData.issue = evt.target.value;
        },

        onClick:function(evt) {
            if(Vue.prototype.$globalData.mode != ISSUE) {
                Vue.prototype.$globalData.mode = ISSUE;
            }
        }
    },

    computed: {
        issues: function () {
          let a = [Vue.prototype.$globalData.filename];
          return Object.values(Vue.prototype.$TCT.issues);
        }
    }
})

Vue.component('candidate-picker', {

    template: `
    <div class="mx-auto p-6">

    <label for="candidatePicker">Candidates:</label><br>

    <select @click="onClick" @change="onChange($event)" name="candidatePicker" id="candidatePicker">
        <option v-for="c in candidates" :value="c[0]" :key="c[0]">{{c[1]}}</option>
    </select>

    </div>
    `,

    methods: {
        onChange:function(evt) {
            Vue.prototype.$globalData.mode = CANDIDATE;
            Vue.prototype.$globalData.candidate = evt.target.value;
        },

        onClick:function(evt) {
            if(Vue.prototype.$globalData.mode != CANDIDATE) {
                Vue.prototype.$globalData.mode = CANDIDATE;
            }
        }
    },

    computed: {
        candidates: function () {
          let a = [Vue.prototype.$globalData.filename];
          return getListOfCandidates();
        }
    }
})

Vue.component('cyoa-picker', {

    template: `
    <div class="mx-auto p-6">

    <button class="bg-gray-300 p-2 my-2 rounded hover:bg-gray-500" v-on:click="gotoCyoa()">CYOA</button>

    </div>
    `,

    methods: {
        gotoCyoa:function(evt) {
            Vue.prototype.$globalData.mode = CYOA;
        },
    }
})

Vue.component('banner-picker', {

    template: `
    <div class="mx-auto p-6">

    <button class="bg-gray-300 p-2 my-2 rounded hover:bg-gray-500" v-on:click="gotoBanner()">Banner Settings</button>

    </div>
    `,

    methods: {
        gotoBanner:function(evt) {
            Vue.prototype.$globalData.mode = BANNER;
        },
    }
})

Vue.component('template-picker', {

    template: `
    <div class="mx-auto p-6">

    <label for="templatePicker">Choose a Template:</label><br>

    <select @change="onChange" name="templatePicker" id="templatePicker">
        <option v-for="template in templates" :value="template">{{trimmedName(template)}}</option>
    </select>

    <p class="text-sm text-gray-700 italic">WARNING: Choosing a new template will erase all existing progress!</p>

    </div>
    `,

    methods: {
        onChange:function(evt) {
            loadData(evt.target.value);
        },

        trimmedName(f) {
            return f.replace(".txt", "")
        }
    },

    computed: {
        templates: function () {
          return TEMPLATE_NAMES;
        }
    }
})