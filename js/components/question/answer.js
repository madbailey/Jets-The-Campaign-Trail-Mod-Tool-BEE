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
        <button class="bg-blue-500 text-white p-2 my-2 rounded hover:bg-blue-600" v-on:click="cloneAnswer()">Clone Answer</button>

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

        cloneAnswer: function() {
            this.$emit('cloneAnswer', this.pk)
            const thisAnswer = Vue.prototype.$TCT.answers[this.pk];
        },

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

// Feedback Card Component
Vue.component('answer-feedback-card', {
    props: ['pk'],

    template: `
    <div class="bg-gray-50 rounded p-3 mb-3 shadow-sm hover:shadow transition-shadow">
        <div class="flex justify-between">
            <h4 class="text-sm font-medium text-gray-700">Feedback #{{pk}}</h4>
            <button @click="$emit('deleteFeedback', pk)" class="text-red-500 hover:text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
        
        <div class="mt-2">
            <label class="block text-xs font-medium text-gray-700">Candidate:</label>
            <div class="flex items-center mt-1">
                <input @input="onInput($event)" :value="candidate" name="candidate" type="number"
                    class="p-1 text-sm block w-20 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <span v-if="candidateNickname" class="ml-2 text-xs text-gray-500">({{candidateNickname}})</span>
            </div>
        </div>
        
        <div class="mt-2">
            <label class="block text-xs font-medium text-gray-700">Feedback Text:</label>
            <textarea @input="onInput($event)" :value="answerFeedback" name="answer_feedback" rows="3"
                class="mt-1 p-2 text-sm block w-full border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
    </div>
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

        candidateNickname: function() {
            return Vue.prototype.$TCT.getNicknameForCandidate(this.candidate);
        },

        answerFeedback: function () {
            return Vue.prototype.$TCT.answer_feedback[this.pk].fields.answer_feedback;
        }
    }
});
