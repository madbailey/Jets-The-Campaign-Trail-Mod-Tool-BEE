let app;

async function loadData() {
    let f = await fetch(`../public/defaultcode2.js`, {mode: "no-cors"});
    let raw = await f.text();
    Vue.prototype.$TCT = loadDataFromFile(raw);
    Vue.prototype.$globalData = Vue.observable({
        question: '343' 
      });
    app = new Vue({el: '#app', data: {}})
}

Vue.component('editor', {
    template: `
    <div class="mx-auto bg-gray-100 p-4">

        <question :pk="question"></question>

    </div>
    `,

    computed: {
        question: function () {
          return Vue.prototype.$globalData.question;
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
            Vue.prototype.$globalData.question = evt.target.value;
        }
    },

    computed: {
        questions: function () {
          return Object.values(Vue.prototype.$TCT.questions);
        }
    }
})

Vue.component('question', {

    props: ['pk'],

    data() {
        return {
          answers:Vue.prototype.$TCT.getAnswersForQuestion(this.pk),
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
        <summary>Answers</summary>
        <button class="bg-green-500 text-white p-2 my-2 rounded hover:bg-green-600" v-on:click="addAnswer()">Add Answer</button>
        <ul>
            <answer v-for="answer in answers" :pk="answer.pk" :key="answer.pk"></answer>
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
            this.answers.push(answer)
            Vue.prototype.$TCT.answers[newPk] = answer;
        },

        onInput: function(evt) {
            Vue.prototype.$TCT.questions[this.pk].fields[evt.target.name] = evt.target.value;
        }
    },

    computed: {
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
        <summary>Answer Feedback</summary>
        <button class="bg-green-500 text-white p-2 my-2 rounded hover:bg-green-600" v-on:click="addFeedback()">Add Feedback</button>
        <ul>
            <answer-feedback v-for="feedback in feedbacks" :pk="feedback.pk" :key="feedback.pk"></answer-feedback>
        </ul>
        </details>

        <details>
        <summary>Global Scores</summary>
        <button class="bg-green-500 text-white p-2 my-2 rounded hover:bg-green-600" v-on:click="addGlobalScore()">Add Global Scores</button>
        <ul>
            <global-score v-for="x in globalScores" :pk="x.pk" :key="x.pk"></global-score>
        </ul>
        </details>

        <details>
        <summary>Issue Scores</summary>
        <button class="bg-green-500 text-white p-2 my-2 rounded hover:bg-green-600" v-on:click="addIssueScore()">Add Issue Score</button>
        <ul>
            <issue-score v-for="x in issueScores" :pk="x.pk" :key="x.pk"></issue-score>
        </ul>
        </details>

        <details>
        <summary>State Scores</summary>
        <button class="bg-green-500 text-white p-2 my-2 rounded hover:bg-green-600" v-on:click="addStateScore()">Add State Score</button>
        <ul>
            <state-score v-for="x in stateScores" :pk="x.pk" :key="x.pk"></state-score>
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
        <textarea @input="onInput($event)" :value="answerFeedback" name="answer_feedback" rows="4" cols="50"></textarea>
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

loadData();