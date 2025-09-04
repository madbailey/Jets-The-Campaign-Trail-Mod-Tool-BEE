// Issue Score Card Component
Vue.component('issue-score-card', {
    props: ['pk'],

    template: `
    <div class="bg-gray-50 rounded p-3 mb-3 shadow-sm hover:shadow transition-shadow">
        <div class="flex justify-between">
            <h4 class="text-sm font-medium text-gray-700">Issue Score #{{pk}}</h4>
            <button @click="$emit('deleteIssueScore', pk)" class="text-red-500 hover:text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
        
        <div class="mt-2">
            <label class="block text-xs font-medium text-gray-700">Issue:</label>
            <select @change="onInput($event)" name="issue" 
                class="mt-1 p-1 text-sm block w-full border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option v-for="i in issues" :selected="i.pk == issue" :value="i.pk" :key="i.pk">
                    {{i.pk}} - {{i.fields.name}}
                </option>
            </select>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div>
                <label class="block text-xs font-medium text-gray-700">Issue Score:</label>
                <div class="flex items-center mt-1">
                    <input @input="onInput($event)" :value="issueScoreDisplay" name="issue_score" type="number" step="0.001"
                        class="p-1 text-sm block w-24 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                    <div class="ml-2 flex-1 h-2 bg-gray-200 rounded">
                        <div class="h-full rounded" 
                            :style="{ width: Math.min(Math.max(parseFloat(issueScoreDisplay) * 20, 0), 100) + '%' }">
                        </div>
                    </div>
                </div>
                <div class="text-xs text-gray-500 mt-1">Higher = more helpful</div>
            </div>

            <div>
                <label class="block text-xs font-medium text-gray-700">Issue Importance:</label>
                <div class="flex items-center mt-1">
                    <input @input="onInput($event)" :value="issueImportanceDisplay" name="issue_importance" type="number" step="0.001"
                        class="p-1 text-sm block w-24 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                    <div class="ml-2 flex-1 h-2 bg-gray-200 rounded">
                        <div class="h-full rounded bg-blue-500" 
                            :style="{ width: Math.min(Math.max(parseFloat(issueImportanceDisplay) * 20, 0), 100) + '%' }">
                        </div>
                    </div>
                </div>
                <div class="text-xs text-gray-500 mt-1">Higher = more important</div>
            </div>
        </div>
    </div>
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
        issues: function() {
            return Object.values(Vue.prototype.$TCT.issues);
        },

        issue: function () {
            return Vue.prototype.$TCT.answer_score_issue[this.pk].fields.issue;
        },

        issueScore: function () {
            return Vue.prototype.$TCT.answer_score_issue[this.pk].fields.issue_score;
        },

        issueImportance: function () {
            return Vue.prototype.$TCT.answer_score_issue[this.pk].fields.issue_importance;
        },

        issueScoreDisplay: function () {
            return this.issueScore !== undefined && this.issueScore !== null ? this.issueScore : 0;
        },

        issueImportanceDisplay: function () {
            return this.issueImportance !== undefined && this.issueImportance !== null ? this.issueImportance : 0;
        }
    }
});

