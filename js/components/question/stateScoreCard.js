// State Score Card Component
Vue.component('state-score-card', {
    props: ['pk'],

    template: `
    <div class="bg-gray-50 rounded p-3 mb-3 shadow-sm hover:shadow transition-shadow">
        <div class="flex justify-between">
            <h4 class="text-sm font-medium text-gray-700">State Score #{{pk}}</h4>
            <button @click="$emit('deleteStateScore', pk)" class="text-red-500 hover:text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
        
        <div class="mt-2">
            <label class="block text-xs font-medium text-gray-700">State:</label>
            <select @change="onInput($event)" name="state" 
                class="mt-1 p-1 text-sm block w-full border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option v-for="s in states" :selected="s.pk == state" :value="s.pk" :key="s.pk">
                    {{s.pk}} - {{s.fields.name}} ({{s.fields.abbr}})
                </option>
            </select>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div>
                <label class="block text-xs font-medium text-gray-700">Candidate:</label>
                <div class="flex items-center mt-1">
                    <input @input="onInput($event)" :value="candidate" name="candidate" type="number"
                        class="p-1 text-sm block w-20 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                    <span v-if="candidateNickname" class="ml-2 text-xs text-gray-500">({{candidateNickname}})</span>
                </div>
            </div>
            
            <div>
                <label class="block text-xs font-medium text-gray-700">Affected Candidate:</label>
                <div class="flex items-center mt-1">
                    <input @input="onInput($event)" :value="affected" name="affected_candidate" type="number"
                        class="p-1 text-sm block w-20 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                    <span v-if="affectedNickname" class="ml-2 text-xs text-gray-500">({{affectedNickname}})</span>
                </div>
            </div>
            
            <div class="mt-3 md:col-span-2">
                <label class="block text-xs font-medium text-gray-700">State Multiplier:</label>
                <div class="flex items-center mt-1">
                    <input @input="onInput($event)" :value="multiplier" name="state_multiplier" type="number" step="0.001"
                        class="p-1 text-sm block w-24 border border-gray-300 rounded shadow-sm focus:ring-blue-500 focus:border-blue-500">
                    <div class="ml-2 flex-1 h-2 bg-gray-200 rounded">
                        <div class="h-full rounded" 
                            :style="{ width: Math.min(Math.max((multiplier + 0.04) * 1250, 0), 100) + '%', 
                                     backgroundColor: multiplier < 0 ? '#ef4444' : '#22c55e' }">
                        </div>
                    </div>
                </div>
                <div class="text-xs text-gray-500 mt-1">
                    <span v-if="multiplier > 0">Helps in this state</span>
                    <span v-else-if="multiplier < 0">Hurts in this state</span>
                    <span v-else>No effect</span>
                </div>
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
});

