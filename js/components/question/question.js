Vue.component('question', {
    props: {
        pk: Number
    },

    data() {
        return {
            temp_answers: [],
            activeAnswer: null,
            activeTab: 'feedback'
        };
    },

    template: `
    <div class="mx-auto p-4">
        <!-- Header with actions -->
        <div class="flex justify-between items-center mb-4 bg-white p-3 rounded-lg shadow">
            <h1 class="font-bold text-xl">Question #{{this.pk}}</h1>
            <div class="flex space-x-2">
                <button class="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Save
                </button>
                <button class="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 flex items-center" v-on:click="deleteQuestion()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                </button>
            </div>
        </div>

        <!-- Question details card -->
        <div class="bg-white rounded-lg shadow mb-6 p-4">
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label for="priority" class="block text-sm font-medium text-gray-700">Priority:</label>
                    <input @input="onInput($event)" :value="priority" name="priority" type="number" 
                        class="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                    <label for="likelihood" class="block text-sm font-medium text-gray-700">Likelihood:</label>
                    <input @input="onInput($event)" :value="likelihood" name="likelihood" type="number" 
                        class="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                    <div class="text-xs text-gray-500 mt-1">Higher values = more likely to appear</div>
                </div>
            </div>
            
            <div>
                <label for="description" class="block text-sm font-medium text-gray-700">Question Text:</label>
                <textarea @input="onInputUpdatePicker($event)" :value="description" name="description" rows="4" 
                    class="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
        </div>

        <!-- Answer management section -->
        <div class="bg-white rounded-lg shadow mb-6">
            <div class="p-4 border-b flex justify-between items-center">
                <h2 class="font-bold text-lg">Answers ({{this.answers.length}})</h2>
                <button class="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 flex items-center" v-on:click="addAnswer()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Answer
                </button>
            </div>
            
            <!-- Answer list and details in split view -->
            <div class="flex flex-col md:flex-row">
                <!-- Left side: Answer list -->
                <div class="md:w-1/2 border-r overflow-y-auto" style="max-height: 600px;">
                    <ul class="divide-y">
                        <li v-for="answer in answers" :key="answer.pk" 
                            :class="{'bg-blue-50': activeAnswer === answer.pk}"
                            class="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                            @click="selectAnswer(answer.pk)">
                            <div class="flex justify-between items-start">
                                <div class="font-medium text-sm">#{{answer.pk}}</div>
                                <div class="flex space-x-1">
                                    <button @click.stop="cloneAnswer(answer.pk)" class="text-blue-500 hover:text-blue-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16l4-4m0 0l4-4m-4 4H4" />
                                        </svg>
                                    </button>
                                    <button @click.stop="deleteAnswer(answer.pk)" class="text-red-500 hover:text-red-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="text-xs text-gray-600 mt-1">{{answer.fields.description}}</div>
                        </li>
                    </ul>
                </div>

                <!-- Right side: Answer details with tabs -->
                <div class="md:w-1/2 p-4">
                    <div v-if="activeAnswer">
                        <div class="bg-white rounded-lg shadow">
                            <div class="border-b">
                                <nav class="flex">
                                    <button @click="activeTab = 'feedback'" 
                                        :class="{'border-blue-500 text-blue-600': activeTab === 'feedback', 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'feedback'}"
                                        class="py-2 px-4 font-medium text-sm border-b-2 flex items-center">
                                        <span class="flex items-center">
                                            <span class="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2" v-if="hasFeedback(activeAnswer)"></span>
                                            Feedback
                                        </span>
                                    </button>
                                    <button @click="activeTab = 'global'" 
                                        :class="{'border-blue-500 text-blue-600': activeTab === 'global', 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'global'}"
                                        class="py-2 px-4 font-medium text-sm border-b-2 flex items-center">
                                        <span class="flex items-center">
                                            <span class="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2" v-if="hasGlobalScores(activeAnswer)"></span>
                                            Global
                                        </span>
                                    </button>
                                    <button @click="activeTab = 'issues'" 
                                        :class="{'border-blue-500 text-blue-600': activeTab === 'issues', 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'issues'}"
                                        class="py-2 px-4 font-medium text-sm border-b-2 flex items-center">
                                        <span class="flex items-center">
                                            <span class="inline-block w-2 h-2 rounded-full bg-green-500 mr-2" v-if="hasIssueScores(activeAnswer)"></span>
                                            Issues
                                        </span>
                                    </button>
                                    <button @click="switchToStatesTab()" 
                                    :class="{'border-blue-500 text-blue-600': activeTab === 'states', 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== 'states'}"
                                    class="py-2 px-4 font-medium text-sm border-b-2 flex items-center">
                                    <span class="flex items-center">
                                        <span class="inline-block w-2 h-2 rounded-full bg-orange-500 mr-2" v-if="hasStateScores(activeAnswer)"></span>
                                        States
                                    </span>
                                </button>
                                </nav>
                            </div>
                            
                            <!-- Tab content -->
                            <div class="p-2 mt-2">
                                <!-- Feedback Tab -->
                                <div v-if="activeTab === 'feedback'">
                                    <div class="flex justify-between items-center mb-3">
                                        <h4 class="font-medium text-sm">Answer Feedback</h4>
                                        <button @click="addFeedback(activeAnswer)" class="bg-blue-500 text-white px-2 py-1 text-xs rounded hover:bg-blue-600">
                                            Add Feedback
                                        </button>
                                    </div>
                                    <answer-feedback-card 
                                        v-for="feedback in getFeedbackForAnswer(activeAnswer)" 
                                        :pk="feedback.pk" 
                                        :key="feedback.pk"
                                        @deleteFeedback="deleteFeedback">
                                    </answer-feedback-card>
                                    <div v-if="!hasFeedback(activeAnswer)" class="text-gray-500 text-sm text-center py-4">
                                        No feedback configured yet
                                    </div>
                                </div>
                                
                                <!-- Global Scores Tab -->
                                <div v-if="activeTab === 'global'">
                                    <div class="flex justify-between items-center mb-3">
                                        <h4 class="font-medium text-sm">Global Scores</h4>
                                        <button @click="addGlobalScore(activeAnswer)" class="bg-purple-500 text-white px-2 py-1 text-xs rounded hover:bg-purple-600">
                                            Add Global Score
                                        </button>
                                    </div>
                                    <global-score-card 
                                        v-for="score in getGlobalScoresForAnswer(activeAnswer)" 
                                        :pk="score.pk" 
                                        :key="score.pk"
                                        @deleteGlobalScore="deleteGlobalScore">
                                    </global-score-card>
                                    <div v-if="!hasGlobalScores(activeAnswer)" class="text-gray-500 text-sm text-center py-4">
                                        No global scores configured yet
                                    </div>
                                </div>

                                <!-- Issue Scores Tab -->
                                <div v-if="activeTab === 'issues'">
                                    <div class="flex justify-between items-center mb-3">
                                        <h4 class="font-medium text-sm">Issue Scores</h4>
                                        <button @click="addIssueScore(activeAnswer)" class="bg-green-500 text-white px-2 py-1 text-xs rounded hover:bg-green-600">
                                            Add Issue Score
                                        </button>
                                    </div>
                                    <issue-score-card 
                                        v-for="score in getIssueScoresForAnswer(activeAnswer)" 
                                        :pk="score.pk" 
                                        :key="score.pk"
                                        @deleteIssueScore="deleteIssueScore">
                                    </issue-score-card>
                                    <div v-if="!hasIssueScores(activeAnswer)" class="text-gray-500 text-sm text-center py-4">
                                        No issue scores configured yet
                                    </div>
                                </div>

                                <!-- States Tab -->
                                <div v-if="activeTab === 'states'">
                                    <div class="flex justify-between items-center mb-3">
                                        <h4 class="font-medium text-sm">State Effects</h4>
                                        <button @click="addStateScore(activeAnswer)" class="bg-orange-500 text-white px-2 py-1 text-xs rounded hover:bg-orange-600">
                                            Add State Score
                                        </button>
                                    </div>
                                    <integrated-state-effect-visualizer 
                                        :answerId="activeAnswer">
                                    </integrated-state-effect-visualizer>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-gray-500 text-sm text-center py-4">
                        Select an answer to view details
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,

    methods: {
        selectAnswer(pk) {
            this.activeAnswer = pk;
        },

        switchToStatesTab() {
            this.activeTab = 'states';
        },

        addAnswer: function() {
            const newPk =  Vue.prototype.$TCT.getNewPk();
            let x = {
                "model": "campaign_trail.answer",
                "pk": newPk,
                "fields": {
                    "question": this.pk,
                    "description": "",
                }
            }
            Vue.prototype.$TCT.answers[newPk] = x;
            this.temp_answers = [x];
        },

        cloneAnswer(pk) {
            const thisAnswer = Vue.prototype.$TCT.answers[pk];
            const newPk = Vue.prototype.$TCT.getNewPk();
            Vue.prototype.$TCT.answers[newPk] = {
                model: thisAnswer.model,
                pk: newPk,
                fields: {
                    ...thisAnswer.fields,
                    description: `${thisAnswer.fields.description} (copy)`
                }
            };
            this.temp_answers = [Vue.prototype.$TCT.answers[newPk]];
            this.activeAnswer = newPk;
        },

        deleteAnswer(pk) {
            delete Vue.prototype.$TCT.answers[pk];
            this.temp_answers = [];
            if (this.activeAnswer === pk) this.activeAnswer = null;
        },

        addFeedback: function(pk) {
            const newPk =  Vue.prototype.$TCT.getNewPk();
            let feedback = {
                "model": "campaign_trail.answer_feedback",
                "pk": newPk,
                "fields": {
                    "answer": pk,
                    "candidate": Vue.prototype.$TCT.getFirstCandidatePK(),
                    "answer_feedback": "put feedback here, don't forget to change candidate"
                }
            }
            Vue.prototype.$TCT.answer_feedback[newPk] = feedback;
            this.temp_answers = [];
        },

        addGlobalScore: function(pk) {
            const newPk =  Vue.prototype.$TCT.getNewPk();
            let x = {
                "model": "campaign_trail.answer_score_global",
                "pk": newPk,
                "fields": {
                    "answer": pk,
                    "candidate": Vue.prototype.$TCT.getFirstCandidatePK(),
                    "affected_candidate": Vue.prototype.$TCT.getFirstCandidatePK(),
                    "global_multiplier": 0
                }
            }
            Vue.prototype.$TCT.answer_score_global[newPk] = x;
            this.temp_answers = [];
        },

        addIssueScore: function(pk) {
            const newPk =  Vue.prototype.$TCT.getNewPk();
            let x = {
                "model": "campaign_trail.answer_score_issue",
                "pk": newPk,
                "fields": {
                    "answer": pk,
                    "issue": Vue.prototype.$TCT.getFirstIssuePK(),
                    "issue_score": 0,
                    "issue_importance": 0
                }
            }
            Vue.prototype.$TCT.answer_score_issue[newPk] = x;
            this.temp_answers = [];
        },

        addStateScore: function(pk) {
            const newPk =  Vue.prototype.$TCT.getNewPk();
            let x = {
                "model": "campaign_trail.answer_score_state",
                "pk": newPk,
                "fields": {
                    "answer": pk,
                    "state": Vue.prototype.$TCT.getFirstStatePK(),
                    "candidate": Vue.prototype.$TCT.getFirstCandidatePK(),
                    "affected_candidate": Vue.prototype.$TCT.getFirstCandidatePK(),
                    "state_multiplier": 0
                }
            }
            Vue.prototype.$TCT.answer_score_state[newPk] = x;
            this.temp_answers = [];
        },

        deleteGlobalScore: function(pk) {
            delete Vue.prototype.$TCT.answer_score_global[pk];
            this.temp_answers = [];
        },

        deleteIssueScore: function(pk) {
            delete Vue.prototype.$TCT.answer_score_issue[pk];
            this.temp_answers = [];
        },

        deleteStateScore: function(pk) {
            delete Vue.prototype.$TCT.answer_score_state[pk];
            this.temp_answers = [];
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
            if (!confirm(`Are you sure you want to delete question #${this.pk}?`)) return;
            
            let referencedAnswers = Vue.prototype.$TCT.getAnswersForQuestion(this.pk);
            for(let i = 0; i < referencedAnswers.length; i++) {
                this.deleteAnswer(referencedAnswers[i].pk);
            }

            Vue.prototype.$TCT.questions.delete(this.pk);
            Vue.prototype.$globalData.question = Array.from(Vue.prototype.$TCT.questions.values())[0].pk;

            const temp = Vue.prototype.$globalData.filename;
            Vue.prototype.$globalData.filename = "";
            Vue.prototype.$globalData.filename = temp;
        },

        getFeedbackForAnswer(pk) {
            return Vue.prototype.$TCT.getAdvisorFeedbackForAnswer(pk);
        },
        
        getGlobalScoresForAnswer(pk) {
            return Vue.prototype.$TCT.getGlobalScoreForAnswer(pk);
        },
        
        getIssueScoresForAnswer(pk) {
            return Vue.prototype.$TCT.getIssueScoreForAnswer(pk);
        },
        
        getStateScoresForAnswer(pk) {
            return Vue.prototype.$TCT.getStateScoreForAnswer(pk);
        },
        
        hasFeedback(pk) {
            return this.getFeedbackForAnswer(pk).length > 0;
        },
        
        hasGlobalScores(pk) {
            return this.getGlobalScoresForAnswer(pk).length > 0;
        },
        
        hasIssueScores(pk) {
            return this.getIssueScoresForAnswer(pk).length > 0;
        },
        
        hasStateScores(pk) {
            return this.getStateScoresForAnswer(pk).length > 0;
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
        
        getAnswerDescription: function() {
            if (!this.activeAnswer) return '';
            return Vue.prototype.$TCT.answers[this.activeAnswer].fields.description;
        }
    }
});

