function loadDefaultUSMap() {
    return fetch('js/components/resources/us.svg')
      .then(response => response.text())
      .catch(_ => null);
}

Vue.component('state-effect-presets', {
    props: { onSelectPreset: Function, selectedStatesCount: Number },
    data() { return { showPresets: false, presetValue: 0.001 }; },
    methods: {
        togglePresets() { this.showPresets = !this.showPresets; },
        selectPreset(category) {
            const states = Object.values(Vue.prototype.$TCT.states);
            let abbrs = [];
            if (category === 'swing') abbrs = ['FL','PA','MI','WI','NC','AZ','NV','GA','NH'];
            else if (category === 'south') abbrs = ['TX','FL','GA','NC','SC','VA','WV','KY','TN','AL','MS','AR','LA','OK'];
            else if (category === 'midwest') abbrs = ['OH','MI','IN','IL','WI','MN','IA','MO','ND','SD','NE','KS'];
            else if (category === 'northeast') abbrs = ['ME','NH','VT','MA','RI','CT','NY','NJ','PA','DE','MD','DC'];
            else if (category === 'west') abbrs = ['CA','WA','OR','NV','AZ','UT','ID','MT','WY','CO','NM','AK','HI'];
            else if (category === 'blue') abbrs = ['CA','NY','IL','MA','MD','HI','CT','ME','RI','DE','WA','OR','NJ','VT','NM','CO','VA','MN'];
            else if (category === 'red') abbrs = ['TX','TN','KY','AL','MS','LA','AR','OK','KS','NE','SD','ND','MT','ID','WY','UT','AK','WV','SC','IN','MO'];
            else if (category === 'small') abbrs = ['WY','VT','DC','AK','ND','SD','DE','MT','RI','NH','ME','HI','ID','WV','NE','NM'];
            else if (category === 'large') abbrs = ['CA','TX','FL','NY','PA','IL','OH','GA','NC','MI','NJ','VA','WA','AZ','MA','TN','IN','MO','MD','WI','MN','CO'];
            const statePks = states.filter(s => abbrs.includes(s.fields.abbr)).map(s => s.pk);
            this.onSelectPreset(statePks);
        },
        applyPresetValue(value) { this.presetValue = value; this.$emit('applyValue', value); }
    },
    template: `
    <div>
        <button @click="togglePresets" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            State Presets
        </button>
        <div v-if="showPresets" class="mt-2 bg-gray-50 p-3 rounded shadow-sm">
            <h4 class="font-medium text-sm mb-2">Select Region:</h4>
            <div class="grid grid-cols-2 gap-1 mb-2">
                <button @click="selectPreset('swing')" class="bg-purple-100 text-purple-800 px-2 py-1 text-xs rounded hover:bg-purple-200">Swing States</button>
                <button @click="selectPreset('south')" class="bg-red-100 text-red-800 px-2 py-1 text-xs rounded hover:bg-red-200">South</button>
                <button @click="selectPreset('midwest')" class="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded hover:bg-yellow-200">Midwest</button>
                <button @click="selectPreset('northeast')" class="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded hover:bg-blue-200">Northeast</button>
                <button @click="selectPreset('west')" class="bg-green-100 text-green-800 px-2 py-1 text-xs rounded hover:bg-green-200">West</button>
                <button @click="selectPreset('blue')" class="bg-blue-300 text-blue-800 px-2 py-1 text-xs rounded hover:bg-blue-400">Blue States</button>
                <button @click="selectPreset('red')" class="bg-red-300 text-red-800 px-2 py-1 text-xs rounded hover:bg-red-400">Red States</button>
                <button @click="selectPreset('small')" class="bg-gray-200 text-gray-800 px-2 py-1 text-xs rounded hover:bg-gray-300">Small States</button>
                <button @click="selectPreset('large')" class="bg-gray-300 text-gray-800 px-2 py-1 text-xs rounded hover:bg-gray-400">Large States</button>
            </div>
        </div>
    </div>`
});

Vue.component('integrated-state-effect-visualizer', {
    props: ['answerId'],
    watch: { answerId(n,o){ if(n!==o){ this.loadStateEffects(); } } },
    data(){ return { candidateId: Vue.prototype.$TCT.getFirstCandidatePK(), affectedCandidateId: Vue.prototype.$TCT.getFirstCandidatePK(), selectedStates: {}, stateEffects: {}, highlightedState: null, editValue: 0,
        colorScale:{positive:['#E3F2FD','#BBDEFB','#90CAF9','#64B5F6','#42A5F5','#2196F3','#1E88E5','#1976D2','#1565C0','#0D47A1'], negative:['#FFEBEE','#FFCDD2','#EF9A9A','#E57373','#EF5350','#F44336','#E53935','#D32F2F','#C62828','#B71C1C'], neutral:'#E0E0E0'},
        mapData:[], mapLoaded:false, fallbackViewBox:null, usingBasicShapes:false, effectListVersion:0 }; },
    mounted(){ this.loadStateEffects(); this.loadMapData(); },
    methods:{
        loadStateEffects(){
            const stateScores = Vue.prototype.$TCT.getStateScoreForAnswer(this.answerId);
            const states = Object.values(Vue.prototype.$TCT.states);
            for(const s of states){ this.$set(this.stateEffects, s.pk, 0); }
            for(const score of stateScores){ if((this.candidateId==null||score.fields.candidate==this.candidateId)&&(this.affectedCandidateId==null||score.fields.affected_candidate==this.affectedCandidateId)){ this.$set(this.stateEffects, score.fields.state, score.fields.state_multiplier); this.$set(this.selectedStates, score.fields.state, true);} }
        },
        loadMapData(){
            if(Vue.prototype.$TCT.jet_data?.mapping_data?.mapSvg){
                try{ this.mapData = Vue.prototype.$TCT.getMapForPreview(Vue.prototype.$TCT.jet_data.mapping_data.mapSvg); this.mapLoaded=true; }
                catch(e){ console.error("Error loading mapSvg:",e); this.loadDefaultMap(); }
            } else if(Vue.prototype.$TCT.states && Object.values(Vue.prototype.$TCT.states).some(s=>s.d)){
                try{ this.mapData = Object.values(Vue.prototype.$TCT.states).filter(s=>s.d).map(s=>[s.fields.abbr,s.d]); this.mapLoaded=true; }
                catch(e){ console.error("Error extracting state paths:",e); this.loadDefaultMap(); }
            } else { this.loadDefaultMap(); }
        },
        loadDefaultMap(){
            loadDefaultUSMap().then(svg=>{ if(svg){ this.validateAndUseDefaultMap(svg); } else { this.createBasicStateShapes(); }});
        },
        validateAndUseDefaultMap(svg){
            const parser=new DOMParser(); const svgDoc=parser.parseFromString(svg,'image/svg+xml'); const statePaths=svgDoc.querySelectorAll('[data-name]');
            if(statePaths.length!==51){ this.createBasicStateShapes(); return; }
            const statesData=Object.values(Vue.prototype.$TCT.states);
            for(const path of statePaths){ const name=path.getAttribute('data-name').trim(); if(!statesData.find(s=>s.fields.name.trim()===name)){ this.createBasicStateShapes(); return; } }
            try{ this.mapData = Vue.prototype.$TCT.getMapForPreview(svg); this.mapLoaded=true; this.fallbackViewBox = '0 0 1000 589'; }
            catch(e){ console.error('Error parsing default map:',e); this.createBasicStateShapes(); }
        },
        createBasicStateShapes(){
            const states = Object.values(Vue.prototype.$TCT.states); const cols=Math.ceil(Math.sqrt(states.length)); const size=40; const padding=10; this.mapData=[];
            for(let i=0;i<states.length;i++){ const row=Math.floor(i/cols); const col=i%cols; const x=col*(size+padding)+50; const y=row*(size+padding)+50; const path=`M${x},${y+5} Q${x},${y} ${x+5},${y} L${x+size-5},${y} Q${x+size},${y} ${x+size},${y+5} L${x+size},${y+size-5} Q${x+size},${y+size} ${x+size-5},${y+size} L${x+5},${y+size} Q${x},${y+size} ${x},${y+size-5} Z`; this.mapData.push([states[i].fields.abbr,path]); }
            this.fallbackViewBox = `0 0 ${cols*(size+padding)+100} ${Math.ceil(states.length/cols)*(size+padding)+100}`; this.usingBasicShapes=true; this.mapLoaded=true;
        },
        deleteStateEffect(pk){ delete Vue.prototype.$TCT.answer_score_state[pk]; this.loadStateEffects(); this.effectListVersion++; this.mapLoaded=false; this.$nextTick(()=>{ this.mapLoaded=true; this.loadMapData(); }); },
        getStateColor(pk){ const v=this.stateEffects[pk]||0; if(v===0) return this.colorScale.neutral; const scale=v>0?this.colorScale.positive:this.colorScale.negative; const i=Math.min(Math.floor(Math.abs(v)*10),9); return scale[i]; },
        toggleStateSelection(pk){ this.$set(this.selectedStates, pk, !this.selectedStates[pk]); if(this.selectedStates[pk]) this.editValue=this.stateEffects[pk]; },
        highlightState(pk){ this.highlightedState=pk; },
        unhighlightState(){ if(!this.isStateSelected(this.highlightedState)) this.highlightedState=null; },
        applyValueToSelectedStates(){ const pks=Object.keys(this.selectedStates).filter(pk=>this.selectedStates[pk]); if(pks.length===0) return; for(const pk of pks){ this.$set(this.stateEffects, pk, parseFloat(this.editValue)); this.updateOrCreateStateEffect(pk, parseFloat(this.editValue)); } this.effectListVersion++; },
        updateOrCreateStateEffect(statePk, value){ const scores=Vue.prototype.$TCT.getStateScoreForAnswer(this.answerId); let existing=null; for(const s of scores){ if(s.fields.state==statePk && s.fields.candidate==this.candidateId && s.fields.affected_candidate==this.affectedCandidateId){ existing=s.pk; break; } } if(existing){ Vue.prototype.$TCT.answer_score_state[existing].fields.state_multiplier=value; } else if(value!==0){ const newPk=Vue.prototype.$TCT.getNewPk(); Vue.prototype.$TCT.answer_score_state[newPk] = { model:'campaign_trail.answer_score_state', pk:newPk, fields:{ answer:this.answerId, state:parseInt(statePk), candidate:this.candidateId, affected_candidate:this.affectedCandidateId, state_multiplier:value } }; } },
        isExtraState(state){ const districtRegex=/(?:Maine|Nebraska|ME|NE|M|N|CD|District|Congressional)[-\s]?(\d+)/i; if(state.fields.abbr==='DC') return true; if(districtRegex.test(state.fields.name)) return true; if(state.fields.abbr && ((state.fields.abbr.startsWith('M')||state.fields.abbr.startsWith('N')) && state.fields.abbr.length===2 && !isNaN(state.fields.abbr.charAt(1)))) return true; return state.fields.name.includes('CD')||state.fields.name.includes('District')||state.fields.name.includes('Congressional'); },
        selectAll(){ for(const s of Object.values(Vue.prototype.$TCT.states)){ this.$set(this.selectedStates, s.pk, true); } },
        clearSelection(){ this.selectedStates = {}; },
        isStateSelected(pk){ return this.selectedStates[pk]===true; },
        isStateHighlighted(pk){ return this.highlightedState===pk; },
        getStateStyle(pk){ const base={ fill:this.getStateColor(pk), stroke:'#666666', 'stroke-width':1, cursor:'pointer' }; if(this.isStateSelected(pk)){ base.stroke='#000000'; base['stroke-width']=2;} else if(this.isStateHighlighted(pk)){ base.stroke='#000000'; base['stroke-width']=1.5;} if(this.fallbackViewBox && Math.abs(this.stateEffects[pk])>0.001){ base.fill=this.getStateColor(pk); if(!this.isStateSelected(pk)&&!this.isStateHighlighted(pk)){ base.stroke='#444444'; base['stroke-width']=1.5; } } return base; },
        increaseValue(){ this.editValue = Math.min(parseFloat(this.editValue)+0.001,1).toFixed(3); },
        decreaseValue(){ this.editValue = Math.max(parseFloat(this.editValue)-0.001,-1).toFixed(3); },
        selectPresetStates(pks){ this.clearSelection(); for(const pk of pks){ this.$set(this.selectedStates, pk, true); } },
        applyPresetValue(v){ this.editValue=v; },
        getStateByAbbr(abbr){ const n=abbr.trim().toUpperCase().replaceAll('-','_'); return Object.values(Vue.prototype.$TCT.states).find(s=>s.fields.abbr.trim().toUpperCase().replaceAll('-','_')===n); },
        getStateTextPosition(state){ if(!this.fallbackViewBox) return {x:0,y:0}; const states=Object.values(Vue.prototype.$TCT.states); const idx=states.findIndex(s=>s.pk===state.pk); const cols=Math.ceil(Math.sqrt(states.length)); const size=40; const padding=10; const row=Math.floor(idx/cols); const col=idx%cols; const x=col*(size+padding)+50+size/2; const y=row*(size+padding)+50+size/2; return {x,y}; },
        getStatePath(state){ const entry=this.mapData.find(x=>{ if(!state||!state.fields||!state.fields.abbr) return false; const ab=state.fields.abbr; return x[0]===ab || x[0]===ab.replaceAll('-','_'); }); return entry?entry[1]:`M0,0 L10,0 L10,10 L0,10 Z`; },
        formatDistrictName(n){ if(n.includes('DC')){ const parts=n.split(' '); const idx=parts.findIndex(p=>p==='DC'||p==='-'); if(idx>0&&parts[idx-1]) return `${parts[idx-1]}-${parts[idx+1]||''}`; } return n; }
    },
    computed:{
        states(){ return Object.values(Vue.prototype.$TCT.states); },
        selectedStatesList(){ return this.states.filter(s=>this.isStateSelected(s.pk)); },
        stateCount(){ return this.states.length; },
        selectedStatesCount(){ return Object.values(this.selectedStates).filter(Boolean).length; },
        isUsingBasicShapes(){ return this.usingBasicShapes; },
        smallStates(){ const small=['CT','RI','DE','NH','VT']; return this.states.filter(s=>small.includes(s.fields.abbr) && !this.isExtraState(s)); },
        extraStates(){ const rx=/(?:Maine|Nebraska|ME|NE|M|N|CD|District|Congressional)[-\s]?(\d+)/i; return this.states.filter(s=>{ if(s.fields.abbr==='DC') return false; if(rx.test(s.fields.name)) return true; if(s.fields.abbr && ((s.fields.abbr.startsWith('M')||s.fields.abbr.startsWith('N')) && s.fields.abbr.length===2 && !isNaN(s.fields.abbr.charAt(1)))) return true; return s.fields.name.includes('CD')||s.fields.name.includes('District')||s.fields.name.includes('Congressional'); }); },
        candidates(){ return getListOfCandidates(); },
        allStateEffectsForAnswer(){ this.effectListVersion; const scores=Vue.prototype.$TCT.getStateScoreForAnswer(this.answerId); return scores.map(sc=>({ pk:sc.pk, stateName:Vue.prototype.$TCT.states[sc.fields.state].fields.name, candidateNickname:Vue.prototype.$TCT.getNicknameForCandidate(sc.fields.candidate), affectedCandidateNickname:Vue.prototype.$TCT.getNicknameForCandidate(sc.fields.affected_candidate), multiplier:sc.fields.state_multiplier })); }
    },
    template:`
    <div class="bg-white">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Candidate:</label>
                <select v-model="candidateId" @change="loadStateEffects" class="p-1 text-sm block w-full border border-gray-300 rounded shadow-sm">
                    <option v-for="c in candidates" :key="c[0]" :value="c[0]">{{c[1]}}</option>
                </select>
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-700 mb-1">Affected Candidate:</label>
                <select v-model="affectedCandidateId" @change="loadStateEffects" class="p-1 text-sm block w-full border border-gray-300 rounded shadow-sm">
                    <option v-for="c in candidates" :key="c[0]" :value="c[0]">{{c[1]}}</option>
                </select>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
            <div class="flex items-center space-x-2">
                <button @click="decreaseValue" class="px-2 py-1 bg-gray-200 rounded">-</button>
                <input v-model.number="editValue" type="number" step="0.001" class="p-1 border rounded w-24" />
                <button @click="increaseValue" class="px-2 py-1 bg-gray-200 rounded">+</button>
                <button @click="applyValueToSelectedStates" class="ml-2 px-3 py-1 bg-green-500 text-white rounded">Apply</button>
            </div>
            <div class="flex items-center space-x-2">
                <button @click="selectAll" class="px-2 py-1 bg-blue-500 text-white rounded">Select All</button>
                <button @click="clearSelection" class="px-2 py-1 bg-gray-300 rounded">Clear</button>
            </div>
            <div class="text-sm text-gray-600 flex items-center">Selected: {{selectedStatesCount}} / {{stateCount}}</div>
        </div>
        <state-effect-presets :onSelectPreset="selectPresetStates" @applyValue="applyPresetValue" :selectedStatesCount="selectedStatesCount"></state-effect-presets>
        <div v-if="mapLoaded" class="mt-4">
            <svg :viewBox="fallbackViewBox || '0 0 1000 589'" class="w-full h-auto border rounded">
                <template v-if="isUsingBasicShapes">
                    <g v-for="state in states" :key="state.pk">
                        <path :d="getStatePath(state)" :style="getStateStyle(state.pk)" @click="toggleStateSelection(state.pk)" @mouseover="highlightState(state.pk)" @mouseleave="unhighlightState()"></path>
                        <text :x="getStateTextPosition(state).x" :y="getStateTextPosition(state).y" dominant-baseline="middle" text-anchor="middle" class="text-[10px] fill-gray-800 select-none">{{ formatDistrictName(state.fields.name) }}</text>
                    </g>
                </template>
                <template v-else>
                    <g v-for="(entry, index) in mapData" :key="index">
                        <path :d="entry[1]" :style="getStateStyle(getStateByAbbr(entry[0])?.pk)" @click="toggleStateSelection(getStateByAbbr(entry[0])?.pk)" @mouseover="highlightState(getStateByAbbr(entry[0])?.pk)" @mouseleave="unhighlightState()"></path>
                    </g>
                </template>
            </svg>
        </div>
        <div class="mt-4">
            <h4 class="font-medium text-sm mb-2">Applied State Effects</h4>
            <ul class="divide-y">
                <li v-for="effect in allStateEffectsForAnswer" :key="effect.pk" class="py-2 flex items-center justify-between">
                    <span class="text-sm">{{ effect.stateName }}: <span :class="{'text-green-600': effect.multiplier > 0, 'text-red-600': effect.multiplier < 0}">{{ effect.multiplier }}</span> ({{ effect.candidateNickname }} → {{ effect.affectedCandidateNickname }})</span>
                    <button class="text-red-500 hover:text-red-700 text-xs" @click="deleteStateEffect(effect.pk)">Delete</button>
                </li>
            </ul>
        </div>
    </div>`
});

