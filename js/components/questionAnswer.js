Vue.component('question', {

    props: {
        pk: Number
    },

    data() {
        return {
            temp_answers: []
        };
    },

    template: `
    <div class="mx-auto p-4">

        <button class="bg-red-500 text-white p-2 my-2 rounded hover:bg-red-600" v-on:click="deleteQuestion()">Delete Question</button><br>

        <h1 class="font-bold">QUESTION PK {{this.pk}}</h1><br>
        <label for="priority">Priority:</label><br>
        <input @input="onInput($event)" :value="priority" name="priority" type="number"><br>
        <label for="likelihood">Likelihood:</label><br>
        <input @input="onInput($event)" :value="likelihood" name="likelihood" type="number"><br>
        <label for="description">Description:</label><br>
        <textarea @input="onInputUpdatePicker($event)" :value="description" name="description" rows="4" cols="50"></textarea>

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
                    "description": "put description here"
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
            let value = evt.target.value;
            if(shouldBeSavedAsNumber(value)) {
                value = Number(value);
            }

            Vue.prototype.$TCT.questions.get(this.pk).fields[evt.target.name] = value;
        },

        onInputUpdatePicker: function(evt) {
            Vue.prototype.$TCT.questions.get(this.pk).fields[evt.target.name] = evt.target.value;
            const temp = Vue.prototype.$globalData.filename;
            Vue.prototype.$globalData.filename = "";
            Vue.prototype.$globalData.filename = temp;
        },

        deleteQuestion() {
            delete Vue.prototype.$TCT.questions.delete(this.pk);
            Vue.prototype.$globalData.question = Array.from(Vue.prototype.$TCT.questions.values())[0].pk;

            const temp = Vue.prototype.$globalData.filename;
            Vue.prototype.$globalData.filename = "";
            Vue.prototype.$globalData.filename = temp;
        }

    },

    computed: {

        answers: function() {
            return this.temp_answers.concat(Vue.prototype.$TCT.getAnswersForQuestion(this.pk));
        },
        
        description: function () {
            this.temp_answers;
            return Vue.prototype.$TCT.questions.get(this.pk).fields.description;
        },

        priority: function () {
            this.temp_answers;
            return Vue.prototype.$TCT.questions.get(this.pk).fields.priority;
        },

        likelihood: function () {
            this.temp_answers;
            return Vue.prototype.$TCT.questions.get(this.pk).fields.likelihood;
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
                    "candidate": Vue.prototype.$TCT.getFirstCandidatePK(),
                    "answer_feedback": "put feedback here, don't forget to change candidate"
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
                    "candidate": Vue.prototype.$TCT.getFirstCandidatePK(),
                    "affected_candidate": Vue.prototype.$TCT.getFirstCandidatePK(),
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
                    "issue": Vue.prototype.$TCT.getFirstIssuePK(),
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
                    "state": Vue.prototype.$TCT.getFirstStatePK(),
                    "candidate": Vue.prototype.$TCT.getFirstCandidatePK(),
                    "affected_candidate": Vue.prototype.$TCT.getFirstCandidatePK(),
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
            let value = evt.target.value;
            if(shouldBeSavedAsNumber(value)) {
                value = Number(value);
            }

            Vue.prototype.$TCT.answers[this.pk].fields[evt.target.name] = value;
        }
    },

    computed: {
        description: function () {
          this.feedbacks;
          this.globalScores;
          this.issueScores;
          this.stateScores;
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
        <input @input="onInput($event)" :value="candidate" name="candidate" type="number"><br>

        <label for="answer_feedback">Answer Feedback:</label><br>
        <textarea @input="onInput($event)" :value="answerFeedback" name="answer_feedback" rows="4" cols="50"></textarea><br>

        <button class="bg-red-500 text-white p-2 my-2 rounded hover:bg-red-600" v-on:click="$emit('deleteFeedback', pk)">Delete Feedback</button>
    </li>
    `,

    methods: {
        onInput: function(evt) {

            let value = evt.target.value;
            if(shouldBeSavedAsNumber(value)) {
                value = Number(value);
            }

            Vue.prototype.$TCT.answer_feedback[this.pk].fields[evt.target.name] = value;
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
        
        <label for="candidate">Candidate <span v-if="candidateNickname" class="italic text-gray-400">({{this.candidateNickname}})</span>:</label><br>
        <input @input="onInput($event)" :value="candidate" name="candidate" type="number"><br>

        <label for="affected_candidate">Affected Candidate <span v-if="affectedNickname" class="italic text-gray-400">({{this.affectedNickname}})</span>:</label><br>
        <input @input="onInput($event)" :value="affected" name="affected_candidate" type="number"><br>

        <label for="global_multiplier">Global Multiplier:</label><br>
        <input @input="onInput($event)" :value="multiplier" name="global_multiplier" type="number"><br>

        <button class="bg-red-500 text-white p-2 my-2 rounded hover:bg-red-600" v-on:click="$emit('deleteGlobalScore', pk)">Delete Global Score</button>
        </li>
    `,

    methods: {
        onInput: function(evt) {

            let value = evt.target.value;

            if(shouldBeSavedAsNumber(value)) {
                value = Number(value);
            }

            console.log(value);

            Vue.prototype.$TCT.answer_score_global[this.pk].fields[evt.target.name] = value;
        }
    },

    computed: {

        candidateNickname: function() {
            return Vue.prototype.$TCT.getNicknameForCandidate(this.candidate);
        },

        affectedNickname: function() {
            return Vue.prototype.$TCT.getNicknameForCandidate(this.affected);
        },

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
        <input @input="onInput($event)" :value="issue" name="issue" type="number"><br>

        <label for="issue_score">Issue Score:</label><br>
        <input @input="onInput($event)" :value="issueScore" name="issue_score" type="number"><br>

        <label for="issue_importance">Issue Importance:</label><br>
        <input @input="onInput($event)" :value="issueImportance" name="issue_importance" type="number"><br>
   
        <button class="bg-red-500 text-white p-2 my-2 rounded hover:bg-red-600" v-on:click="$emit('deleteIssueScore', pk)">Delete Issue Score</button>
    </li>
    `,

    methods: {
        onInput: function(evt) {

            let value = evt.target.value;
            if(shouldBeSavedAsNumber(value)) {
                value = Number(value);
            }

            Vue.prototype.$TCT.answer_score_issue[this.pk].fields[evt.target.name] = value;
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
        
        <label for="state">State PK:</label><br>
        <select @change="onInput($event)" name="state">
            <option v-for="s in states" :selected="s.pk == state" :value="s.pk" :key="s.pk">{{s.pk}} - {{s.fields.abbr}}</option>
        </select><br>

        <label for="candidate">Candidate <span v-if="candidateNickname" class="italic text-gray-400">({{this.candidateNickname}})</span>:</label><br>
        <input @input="onInput($event)" :value="candidate" name="candidate" type="number"><br>

        <label for="affected_candidate">Affected Candidate <span v-if="affectedNickname" class="italic text-gray-400">({{this.affectedNickname}})</span>:</label><br>
        <input @input="onInput($event)" :value="affected" name="affected_candidate" type="number"><br>

        <label for="state_multiplier">State Multiplier:</label><br>
        <input @input="onInput($event)" :value="multiplier" name="state_multiplier" type="number"><br>

        <button class="bg-red-500 text-white p-2 my-2 rounded hover:bg-red-600" v-on:click="$emit('deleteStateScore', pk)">Delete State Score</button>
    </li>
    `,

    methods: {
        onInput: function(evt) {
            
            let value = evt.target.value;
            if(shouldBeSavedAsNumber(value)) {
                value = Number(value);
            }

            Vue.prototype.$TCT.answer_score_state[this.pk].fields[evt.target.name] = value;
        }
    },

    computed: {

        candidateNickname: function() {
            return Vue.prototype.$TCT.getNicknameForCandidate(this.candidate);
        },

        affectedNickname: function() {
            return Vue.prototype.$TCT.getNicknameForCandidate(this.affected);
        },
        
        candidate: function () {
          return Vue.prototype.$TCT.answer_score_state[this.pk].fields.candidate;
        },

        affected: function () {
            return Vue.prototype.$TCT.answer_score_state[this.pk].fields.affected_candidate;
        },

        multiplier: function () {
            return Vue.prototype.$TCT.answer_score_state[this.pk].fields.state_multiplier;
        },

        state: function() {
            return Vue.prototype.$TCT.answer_score_state[this.pk].fields.state;
        },

        states: function() {
            return Object.values(Vue.prototype.$TCT.states);
        }
    }
})