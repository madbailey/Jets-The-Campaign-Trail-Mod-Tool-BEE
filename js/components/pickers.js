Vue.component('question-picker', {

    template: `
    <div class="mx-auto p-3">

    <label for="questionPicker">Questions <span class="text-gray-700 italic">({{numberOfQuestions}})</span>:</label><br>

    <select @click="onClick" @change="onChange($event)" name="questionPicker" id="questionPicker">
        <option v-for="question in questions" :value="question.pk" :key="question.pk" :selected="currentQuestion == question.pk">{{question.pk}} - {{questionDescription(question)}}</option>
    </select><br>

    <button class="bg-green-500 text-white p-2 my-2 rounded hover:bg-green-600" v-on:click="addQuestion()">Add Question</button>
    <button class="bg-blue-500 text-white p-2 my-2 rounded hover:bg-blue-600" v-on:click="cloneQuestion()">Clone Question</button>

    <p class="text-xs text-gray-700 italic">WARNING: When adding and deleting questions, remember that your code 1 needs to have the same number of questions as in your code 2!</p>

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

        cloneQuestion: function() {
            const newQuestion = Vue.prototype.$TCT.cloneQuestion(Vue.prototype.$globalData.question);
            
            const temp = Vue.prototype.$globalData.filename;
            Vue.prototype.$globalData.filename = "";
            Vue.prototype.$globalData.filename = temp;

            Vue.prototype.$globalData.mode = QUESTION;
            Vue.prototype.$globalData.question = newQuestion.pk;
        },

        questionDescription:function(question) {
            if(!question.fields.description) {
                return "ERR BAD DESCRIPTION";
            }
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
    <div class="mx-auto p-3">

    <label for="statePicker">States:</label><br>

    <select @click="onClick" @change="onChange($event)" name="statePicker" id="statePicker">
        <option v-for="state in states" :value="state.pk" :selected="currentState == state.pk"  :key="state.pk">{{state.pk}} - {{state.fields.abbr}}</option>
    </select>

    <br>
    <button class="bg-green-500 text-white p-2 my-2 rounded hover:bg-green-600" v-on:click="addState()">Add State</button>

    <p class="text-xs text-gray-700 italic">WARNING: If you add a state with the Add State button the abbreviation will need to exist in your map svg. Also change the election pk to your election. Use only if you know what you're doing.</p>

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
        },

        addState:function(evt) {

            let newPk = Vue.prototype.$TCT.createNewState();
           
            const temp = Vue.prototype.$globalData.filename;
            Vue.prototype.$globalData.filename = "";
            Vue.prototype.$globalData.filename = temp;

            Vue.prototype.$globalData.mode = STATE;
            Vue.prototype.$globalData.state = newPk;

            this.onChange(newPk);
        }
    },

    computed: {
        states: function () {
          let a = [Vue.prototype.$globalData.filename];
          return Object.values(Vue.prototype.$TCT.states);
        },

        currentState: function() {
            return Vue.prototype.$globalData.state;
        }
    }
})

Vue.component('issue-picker', {

    template: `
    <div class="mx-auto p-3">

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
    <div class="mx-auto p-3">

    <label for="candidatePicker">Candidates:</label><br>

    <select @click="onClick" @change="onChange($event)" name="candidatePicker" id="candidatePicker">
        <option v-for="c in candidates" :selected="currentCandidate == c[0]" :value="c[0]" :key="c[0]">{{c[1]}}</option>
    </select>
    <br>
    <button class="bg-green-500 text-white p-2 my-2 rounded hover:bg-green-600" v-on:click="addCandidate()">Add Candidate</button>

    </div>
    `,

    methods: {

        addCandidate: function() {
            const newCandidatePk = Vue.prototype.$TCT.addCandidate();
            Vue.prototype.$globalData.mode = CANDIDATE;
            Vue.prototype.$globalData.candidate = newCandidatePk;

            const temp = Vue.prototype.$globalData.filename;
            Vue.prototype.$globalData.filename = "";
            Vue.prototype.$globalData.filename = temp;
        },

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
        currentCandidate: function () {
            return Vue.prototype.$globalData.candidate;
        },
        candidates: function () {
          let a = [Vue.prototype.$globalData.filename];
          return getListOfCandidates();
        }
    }
})

Vue.component('cyoa-picker', {

    template: `
    <div class="mx-auto py-1 px-3">

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
    <div class="mx-auto py-1 px-3">

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
    <div class="mx-auto py-1 px-3">

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

Vue.component('ending-picker', {

    template: `
    <div class="mx-auto py-1 px-3">

    <button class="bg-gray-300 p-2 my-2 rounded hover:bg-gray-500" v-on:click="gotoEndings()">Custom Endings</button>

    </div>
    `,

    methods: {
        gotoEndings:function(evt) {
            Vue.prototype.$globalData.mode = ENDINGS;
        },
    }
})

Vue.component('mapping-picker', {

    template: `
    <div class="mx-auto py-1 px-3">

    <button class="bg-gray-300 p-2 my-2 rounded hover:bg-gray-500" v-on:click="gotoMapping()">Custom Map Tools</button>

    </div>
    `,

    methods: {
        gotoMapping:function(evt) {
            Vue.prototype.$globalData.mode = MAPPING;
        },
    }
})

Vue.component('bulk-picker', {

    template: `
    <div class="mx-auto py-1 px-3">

    <button class="bg-gray-300 p-2 my-2 rounded hover:bg-gray-500" v-on:click="gotoBulk()">Bulk Tools</button>

    </div>
    `,

    methods: {
        gotoBulk:function(evt) {
            Vue.prototype.$globalData.mode = BULK;
        },
    }
})