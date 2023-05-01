let app;

const QUESTION = "QUESTION";
const STATE = "STATE";
const ISSUE = "ISSUE";
const CANDIDATE = "CANDIDATE";

async function loadData() {
    let mode = QUESTION;
    let raw;

    let f = await fetch(`./public/defaultcode2.js`, {mode: "no-cors"});
    raw = await f.text();
    

    Vue.prototype.$TCT = loadDataFromFile(raw);
    Vue.prototype.$globalData = Vue.observable({
        mode: mode,
        question: Object.values(Vue.prototype.$TCT.questions)[0].pk,
        state: null,
        filename: "default"
    });

    console.log("Loaded data: ", data);
    console.log("Mode is: ", Vue.prototype.$globalData.mode)

    app = new Vue({el: '#app', data: {}})
}

Vue.component('toolbar', {
    template: `
    <div class="flex mx-auto bg-gray-100 p-4">
    <input type="file" id="file" style="display:none;" @change="fileUploaded($event)"></input>
    <button class="bg-gray-300 p-2 m-2 rounded hover:bg-gray-500" v-on:click="importCode2()">Import Code 2</button>
    <button class="bg-gray-300 p-2 m-2 rounded hover:bg-gray-500" v-on:click="exportCode2()">Export Code 2</button>
    <br>

    </div>
    `,

    methods: {

        fileUploaded: function(evt) {
            const file = evt.target.files[0];
            
            if (file) {
                var reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = function (evt) {
                    try {
                        Vue.prototype.$TCT = loadDataFromFile(evt.target.result);
                        Vue.prototype.$globalData.question = Object.values(Vue.prototype.$TCT.questions)[0].pk;
                        Vue.prototype.$globalData.filename = file.name;
                    } catch(e) {
                        alert("Error parsing uploaded file: " + e)
                    }
                    
                }
                reader.onerror = function (evt) {
                    alert("Error reading uploaded file!")
                }
            }
            
            
        },

        importCode2: function() {
            const input = document.getElementById("file");
            input.click();
        },

        exportCode2: function() {
            const f = Vue.prototype.$TCT.exportCode2();

            let element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(f));
            element.setAttribute('download', Vue.prototype.$globalData.filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        }
    }
})

Vue.component('editor', {
    template: `
    <div class="mx-auto bg-gray-100 p-4">

        <question v-if="currentMode == 'QUESTION'" :pk="question"></question>
        <state v-if="currentMode == 'STATE'" :pk="state"></state>
    </div>
    `,

    computed: {

        currentMode: function() {
            return Vue.prototype.$globalData.mode;
        },

        question: function () {
            return Vue.prototype.$globalData.question;
        },

        state: function () {
            return Vue.prototype.$globalData.state;
        },
    }
})

Vue.component('question-picker', {

    template: `
    <div class="mx-auto bg-gray-100 p-4">

    <label for="questionPicker">Questions:</label>

    <select @change="onChange($event)" name="questionPicker" id="questionPicker">
        <option v-for="question in questions" :value="question.pk" :key="question.pk">{{question.pk}} - {{questionDescription(question)}}</option>
    </select>

    </div>
    `,

    methods: {
        questionDescription:function(question) {
            return question.fields.description.slice(0,12) + "...";
        },

        onChange:function(evt) {
            Vue.prototype.$globalData.mode = QUESTION;
            Vue.prototype.$globalData.question = evt.target.value;
        }
    },

    computed: {
        questions: function () {
          let a = [Vue.prototype.$globalData.filename];
          return Object.values(Vue.prototype.$TCT.questions);
        }
    }
})

Vue.component('state-picker', {

    template: `
    <div class="mx-auto bg-gray-100 p-4">

    <label for="statePicker">States:</label>

    <select @change="onChange($event)" name="statePicker" id="statePicker">
        <option v-for="state in states" :value="state.pk" :key="state.pk">{{state.pk}} - {{state.fields.abbr}}</option>
    </select>

    </div>
    `,

    methods: {
        onChange:function(evt) {
            Vue.prototype.$globalData.mode = STATE;
            Vue.prototype.$globalData.state = evt.target.value;
        }
    },

    computed: {
        states: function () {
          let a = [Vue.prototype.$globalData.filename];
          return Object.values(Vue.prototype.$TCT.states);
        }
    }
})

Vue.component('question', {

    props: ['pk'],

    data() {
        return {
            temp_answers: []
        };
    },

    template: `
    <div class="mx-auto bg-gray-100 p-4">

        <h1 class="font-bold">QUESTION PK {{this.pk}}</h1><br>
        <label for="priority">Priority:</label><br>
        <input @input="onInput($event)" :value="priority" name="priority" type="text"><br>
        <label for="likelihood">Likelihood:</label><br>
        <input @input="onInput($event)" :value="likelihood" name="likelihood" type="text"><br>
        <label for="description">Description:</label><br>
        <textarea @input="onInput($event)" :value="description" name="description" rows="4" cols="50"></textarea>

        <details open>
        <summary>Answers ({{this.answers.length}})</summary>
        <button class="bg-green-500 text-white p-2 my-2 rounded hover:bg-green-600" v-on:click="addAnswer()">Add Answer</button>
        <ul>
            <answer @deleteAnswer="deleteAnswer" v-for="answer in answers" :pk="answer.pk" :key="answer.pk"></answer>
        </ul>
        </details>

    </div>
    `,

    methods: {

        addAnswer: function() {
            const newPk =  Vue.prototype.$TCT.getNewPk();
            let answer = {
                "model": "campaign_trail.answer",
                "pk": newPk,
                "fields": {
                    "question": this.pk,
                    "description": "[put description here]"
                }
            }
            this.temp_answers = [];
            Vue.prototype.$TCT.answers[newPk] = answer;
        },

        deleteAnswer: function(pk) {
            this.temp_answers = []
            delete Vue.prototype.$TCT.answers[pk];
        },

        onInput: function(evt) {
            Vue.prototype.$TCT.questions[this.pk].fields[evt.target.name] = evt.target.value;
        },


    },

    computed: {

        answers: function() {
            return this.temp_answers.concat(Vue.prototype.$TCT.getAnswersForQuestion(this.pk));
        },
        
        description: function () {
          return Vue.prototype.$TCT.questions[this.pk].fields.description;
        },

        priority: function () {
            return Vue.prototype.$TCT.questions[this.pk].fields.priority;
        },

        likelihood: function () {
            return Vue.prototype.$TCT.questions[this.pk].fields.likelihood;
        },
    }
})

Vue.component('answer', {

    props: ['pk'],

    data() {
        return {
            feedbacks: Vue.prototype.$TCT.getAdvisorFeedbackForAnswer(this.pk),
    
            globalScores: Vue.prototype.$TCT.getGlobalScoreForAnswer(this.pk),
    
            issueScores: Vue.prototype.$TCT.getIssueScoreForAnswer(this.pk),
    
            stateScores: Vue.prototype.$TCT.getStateScoreForAnswer(this.pk),
        };
    },

    template: `
    <li class="mx-auto bg-gray-100 p-4">
        <h1 class="font-bold">ANSWER PK {{this.pk}}</h1><br>
        <label for="description">Description:</label><br>
        <textarea @input="onInput($event)" :value="description" name="description" rows="4" cols="50"></textarea><br>
        
        <button class="bg-red-500 text-white p-2 my-2 rounded hover:bg-red-600" v-on:click="deleteAnswer()">Delete Answer</button>

        <details>
        <summary>Answer Feedback ({{this.feedbacks.length}})</summary>
        <button class="bg-green-500 text-white p-2 my-2 rounded hover:bg-green-600" v-on:click="addFeedback()">Add Feedback</button>
        <ul>
            <answer-feedback @deleteFeedback="deleteFeedback" v-for="feedback in feedbacks" :pk="feedback.pk" :key="feedback.pk"></answer-feedback>
        </ul>
        </details>

        <details>
        <summary>Global Scores ({{this.globalScores.length}})</summary>
        <button class="bg-green-500 text-white p-2 my-2 rounded hover:bg-green-600" v-on:click="addGlobalScore()">Add Global Scores</button>
        <ul>
            <global-score @deleteGlobalScore="deleteGlobalScore" v-for="x in globalScores" :pk="x.pk" :key="x.pk"></global-score>
        </ul>
        </details>

        <details>
        <summary>Issue Scores ({{this.issueScores.length}})</summary>
        <button class="bg-green-500 text-white p-2 my-2 rounded hover:bg-green-600" v-on:click="addIssueScore()">Add Issue Score</button>
        <ul>
            <issue-score @deleteIssueScore="deleteIssueScore" v-for="x in issueScores" :pk="x.pk" :key="x.pk"></issue-score>
        </ul>
        </details>

        <details>
        <summary>State Scores ({{this.stateScores.length}})</summary>
        <button class="bg-green-500 text-white p-2 my-2 rounded hover:bg-green-600" v-on:click="addStateScore()">Add State Score</button>
        <ul>
            <state-score @deleteStateScore="deleteStateScore" v-for="x in stateScores" :pk="x.pk" :key="x.pk"></state-score>
        </ul>
        </details>

    </li>
    `,

    methods: {

        addFeedback: function() {
            const newPk =  Vue.prototype.$TCT.getNewPk();
            let feedback = {
                "model": "campaign_trail.answer_feedback",
                "pk": newPk,
                "fields": {
                    "answer": this.pk,
                    "candidate": 0,
                    "answer_feedback": "[put feedback here, don't forget to change candidate]"
                }
            }
            this.feedbacks.push(feedback)
            Vue.prototype.$TCT.answer_feedback[newPk] = feedback;
        },

        addGlobalScore: function() {
            const newPk =  Vue.prototype.$TCT.getNewPk();
            let x = {
                "model": "campaign_trail.answer_score_global",
                "pk": newPk,
                "fields": {
                    "answer": this.pk,
                    "candidate": 0,
                    "affected_candidate": 0,
                    "global_multiplier": 0
                }
            }
            this.globalScores.push(x)
            Vue.prototype.$TCT.answer_score_global[newPk] = x;
        },

        addIssueScore: function() {
            const newPk =  Vue.prototype.$TCT.getNewPk();
            let x = {
                "model": "campaign_trail.answer_score_issue",
                "pk": newPk,
                "fields": {
                    "answer": this.pk,
                    "issue": 0,
                    "issue_score": 0,
                    "issue_importance": 0
                }
            }
            this.issueScores.push(x)
            Vue.prototype.$TCT.answer_score_issue[newPk] = x;
        },

        addStateScore: function() {
            const newPk =  Vue.prototype.$TCT.getNewPk();
            let x = {
                "model": "campaign_trail.answer_score_state",
                "pk": newPk,
                "fields": {
                    "answer": this.pk,
                    "state": 0,
                    "candidate": 0,
                    "affected_candidate": 0,
                    "state_multiplier": 0
                }
            }
            this.stateScores.push(x)
            Vue.prototype.$TCT.answer_score_state[newPk] = x;
        },

        deleteAnswer: function() {
            this.$emit('deleteAnswer', this.pk)
        },

        deleteFeedback: function(pk) {
            console.log("delete feedback", pk)
            this.feedbacks = this.feedbacks.filter(a => a.pk != pk);
            delete Vue.prototype.$TCT.answer_feedback[pk];
        },

        deleteGlobalScore: function(pk) {
            this.globalScores = this.globalScores.filter(a => a.pk != pk);
            delete Vue.prototype.$TCT.answer_score_global[pk];
        },

        deleteIssueScore: function(pk) {
            this.issueScores = this.issueScores.filter(a => a.pk != pk);
            delete Vue.prototype.$TCT.answer_score_issue[pk];
        },

        deleteStateScore: function(pk) {
            this.stateScores = this.stateScores.filter(a => a.pk != pk);
            delete Vue.prototype.$TCT.answer_score_state[pk];
        },

        onInput: function(evt) {
            Vue.prototype.$TCT.answers[this.pk].fields[evt.target.name] = evt.target.value;
        }
    },

    computed: {
        description: function () {
          return Vue.prototype.$TCT.answers[this.pk].fields.description;
        },
    }
})

Vue.component('answer-feedback', {

    props: ['pk'],

    template: `
    <li class="mx-auto bg-gray-100 p-4">

        <h1 class="font-bold">ANSWER FEEDBACK PK {{this.pk}}</h1><br>
        
        <label for="candidate">Candidate:</label><br>
        <input @input="onInput($event)" :value="candidate" name="candidate" type="text"><br>

        <label for="answer_feedback">Answer Feedback:</label><br>
        <textarea @input="onInput($event)" :value="answerFeedback" name="answer_feedback" rows="4" cols="50"></textarea><br>

        <button class="bg-red-500 text-white p-2 my-2 rounded hover:bg-red-600" v-on:click="$emit('deleteFeedback', pk)">Delete Feedback</button>
    </li>
    `,

    methods: {
        onInput: function(evt) {
            Vue.prototype.$TCT.answer_feedback[this.pk].fields[evt.target.name] = evt.target.value;
        }
    },

    computed: {
        candidate: function () {
          return Vue.prototype.$TCT.answer_feedback[this.pk].fields.candidate;
        },

        answerFeedback: function () {
            return Vue.prototype.$TCT.answer_feedback[this.pk].fields.answer_feedback;
        },
    }
})

Vue.component('global-score', {

    props: ['pk'],

    template: `
    <li class="mx-auto bg-gray-100 p-4">
        <h1 class="font-bold">GLOBAL SCORE PK {{this.pk}}</h1><br>
        
        <label for="candidate">Candidate:</label><br>
        <input @input="onInput($event)" :value="candidate" name="candidate" type="text"><br>

        <label for="affected_candidate">Affected Candidate:</label><br>
        <input @input="onInput($event)" :value="affected" name="affected_candidate" type="text"><br>

        <label for="global_multiplier">Global Multiplier:</label><br>
        <input @input="onInput($event)" :value="multiplier" name="global_multiplier" type="text"><br>

        <button class="bg-red-500 text-white p-2 my-2 rounded hover:bg-red-600" v-on:click="$emit('deleteGlobalScore', pk)">Delete Global Score</button>
        </li>
    `,

    methods: {
        onInput: function(evt) {
            Vue.prototype.$TCT.answer_score_global[this.pk].fields[evt.target.name] = evt.target.value;
        }
    },

    computed: {
        candidate: function () {
          return Vue.prototype.$TCT.answer_score_global[this.pk].fields.candidate;
        },

        affected: function () {
            return Vue.prototype.$TCT.answer_score_global[this.pk].fields.affected_candidate;
        },

        multiplier: function () {
            return Vue.prototype.$TCT.answer_score_global[this.pk].fields.global_multiplier;
        },
    }
})

Vue.component('issue-score', {

    props: ['pk'],

    template: `
    <li class="mx-auto bg-gray-100 p-4">
        <h1 class="font-bold">ISSUE SCORE PK {{this.pk}}</h1><br>
        
        <label for="issue">Issue PK:</label><br>
        <input @input="onInput($event)" :value="issue" name="issue" type="text"><br>

        <label for="issue_score">Issue Score:</label><br>
        <input @input="onInput($event)" :value="issueScore" name="issue_score" type="text"><br>

        <label for="issue_importance">Issue Importance:</label><br>
        <input @input="onInput($event)" :value="issueImportance" name="issue_importance" type="text"><br>
   
        <button class="bg-red-500 text-white p-2 my-2 rounded hover:bg-red-600" v-on:click="$emit('deleteIssueScore', pk)">Delete Issue Score</button>
    </li>
    `,

    methods: {
        onInput: function(evt) {
            Vue.prototype.$TCT.answer_score_issue[this.pk].fields[evt.target.name] = evt.target.value;
        }
    },

    computed: {
        issue: function () {
          return Vue.prototype.$TCT.answer_score_issue[this.pk].fields.issue;
        },

        issueScore: function () {
            return Vue.prototype.$TCT.answer_score_issue[this.pk].fields.issue_score;
        },

        issueImportance: function () {
            return Vue.prototype.$TCT.answer_score_issue[this.pk].fields.issue_importance;
        },
    }
})

Vue.component('state-score', {

    props: ['pk'],

    template: `
    <li class="mx-auto bg-gray-100 p-4">
        <h1 class="font-bold">STATE SCORE PK {{this.pk}}</h1><br>
        
        <label for="candidate">Candidate:</label><br>
        <input @input="onInput($event)" :value="candidate" name="candidate" type="text"><br>

        <label for="affected_candidate">Affected Candidate:</label><br>
        <input @input="onInput($event)" :value="affected" name="affected_candidate" type="text"><br>

        <label for="state_multiplier">State Multiplier:</label><br>
        <input @input="onInput($event)" :value="multiplier" name="state_multiplier" type="text"><br>

        <button class="bg-red-500 text-white p-2 my-2 rounded hover:bg-red-600" v-on:click="$emit('deleteStateScore', pk)">Delete State Score</button>
    </li>
    `,

    methods: {
        onInput: function(evt) {
            Vue.prototype.$TCT.answer_score_state[this.pk].fields[evt.target.name] = evt.target.value;
        }
    },

    computed: {
        candidate: function () {
          return Vue.prototype.$TCT.answer_score_state[this.pk].fields.candidate;
        },

        affected: function () {
            return Vue.prototype.$TCT.answer_score_state[this.pk].fields.affected_candidate;
        },

        multiplier: function () {
            return Vue.prototype.$TCT.answer_score_state[this.pk].fields.state_multiplier;
        },
    }
})

Vue.component('state', {

    props: ['pk'],

    template: `
    <div class="mx-auto bg-gray-100 p-4">

    <h1 class="font-bold">{{stateName}} - STATE PK {{this.pk}}</h1><br>
    <label for="electoral_votes">Electoral Votes:</label><br>
    <input @input="onInput($event)" :value="electoralVotes" name="electoral_votes" type="text"><br>
    <label for="popular_votes">Popular Votes:</label><br>
    <input @input="onInput($event)" :value="popularVotes" name="popular_votes" type="text"><br>

    <details open>
    <summary>Candidate State Multipliers ({{this.candidateStateMultipliers.length}})</summary>
    <ul>
        <candidate-state-multiplier v-for="c in candidateStateMultipliers" :pk="c.pk" :key="c.pk"></candidate-state-multiplier>
    </ul>
    </details>

    <details open>
    <summary>State Issue Scores ({{this.stateIssueScores.length}})</summary>
    <ul>
        <state-issue-score v-for="c in stateIssueScores" :pk="c.pk" :key="c.pk"></state-issue-score>
    </ul>
    </details>

    </div>
    `,

    methods: {
        onInput: function(evt) {
            Vue.prototype.$TCT.states[this.pk].fields[evt.target.name] = evt.target.value;
        }
    },

    computed: {

        stateName: function() {
            return Vue.prototype.$TCT.states[this.pk].fields.name;
        },

        electoralVotes: function () {
            return Vue.prototype.$TCT.states[this.pk].fields.electoral_votes;
          },
  
        popularVotes: function () {
            return Vue.prototype.$TCT.states[this.pk].fields.popular_votes;
        },

        candidateStateMultipliers: function () {
            return Vue.prototype.$TCT.getCandidateStateMultipliersForState(this.pk);
        },

        stateIssueScores: function () {
            return Vue.prototype.$TCT.getIssueScoreForState(this.pk);
        }
    }
})

Vue.component('candidate-state-multiplier', {

    props: ['pk'],

    template: `
    <li class="mx-auto bg-gray-100 p-4">
        <h1 class="font-bold">CANDIDATE STATE MULTIPLIER PK {{this.pk}}</h1><br>
        
        <label for="state_multiplier">Candidate PK {{candidate}} State Multiplier:</label><br>
        <input @input="onInput($event)" :value="stateMultiplier" name="state_multiplier" type="text"><br>
    </li>
    `,

    methods: {
        onInput: function(evt) {
            Vue.prototype.$TCT.candidate_state_multiplier[this.pk].fields[evt.target.name] = evt.target.value;
        }
    },

    computed: {
        stateMultiplier: function () {
          return Vue.prototype.$TCT.candidate_state_multiplier[this.pk].fields.state_multiplier;
        },

        candidate : function () {
            return Vue.prototype.$TCT.candidate_state_multiplier[this.pk].fields.candidate;
        }
    }
})

Vue.component('state-issue-score', {

    props: ['pk'],

    template: `
    <li class="mx-auto bg-gray-100 p-4">
        <h1 class="font-bold">STATE ISSUE SCORE PK {{this.pk}}</h1><br>
        
        <label for="issue">Issue PK</label><br>
        <input @input="onInput($event)" :value="issue" name="issue" type="text"><br>
    
        <label for="state_issue_score">State Issue Score</label><br>
        <input @input="onInput($event)" :value="stateIssueScore" name="state_issue_score" type="text"><br>
    
        <label for="weight">Issue Weight</label><br>
        <input @input="onInput($event)" :value="weight" name="weight" type="text"><br>
    
    </li>
    `,

    methods: {
        onInput: function(evt) {
            Vue.prototype.$TCT.state_issue_scores[this.pk].fields[evt.target.name] = evt.target.value;
        }
    },

    computed: {
        issue: function () {
            return Vue.prototype.$TCT.state_issue_scores[this.pk].fields.issue;
        },

        stateIssueScore : function () {
            return Vue.prototype.$TCT.state_issue_scores[this.pk].fields.state_issue_score;
        },

        weight : function () {
            return Vue.prototype.$TCT.state_issue_scores[this.pk].fields.weight;
        }
    }
})


loadData();