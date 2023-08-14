Vue.component('state', {

    props: ['pk'],

    template: `
    <div class="mx-auto bg-gray-100 p-4">

    <button class="bg-red-500 text-white p-2 my-2 rounded hover:bg-red-600" v-on:click="deleteState()">Delete State</button>

    <h1 class="font-bold">{{stateName}} - STATE PK {{this.pk}}</h1><br>

    <label for="name">State Name:</label><br>
    <input @input="onInput($event)" :value="stateName" name="name" type="text"><br><br>

    <label for="abbr">State Abbreviation:</label><br>
    <input @input="onInput($event)" :value="abbr" name="abbr" type="text"><br><br>

    <label for="electoral_votes">Electoral Votes:</label><br>
    <input @input="onInput($event)" :value="electoralVotes" name="electoral_votes" type="number"><br>
    <label for="popular_votes">Popular Votes:</label><br>
    <input @input="onInput($event)" :value="popularVotes" name="popular_votes" type="number"><br>

    <label for="poll_closing_time">Poll Closing Time</label><br>
    <input @input="onInput($event)" :value="pollClosingTime" name="poll_closing_time" type="number"><br>

    <label for="winner_take_all_flg">Winner Take All Flag (0/1):</label><br>
    <input @input="onInput($event)" :value="winnerTakeAll" name="winner_take_all_flg" type="number"><br>

    <label for="election">Election PK (IMPORTANT! MAKE SURE THIS IS YOURS):</label><br>
    <input @input="onInput($event)" :value="election" name="election" type="number"><br>

    <br>

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

        deleteState: function() {

            Vue.prototype.$TCT.deleteState(this.pk);
            Vue.prototype.$globalData.state = Vue.prototype.$TCT.getFirstStatePK();

            Vue.prototype.$globalData.mode = QUESTION;
            Vue.prototype.$globalData.mode = STATE;
            const temp = Vue.prototype.$globalData.filename;
            Vue.prototype.$globalData.filename = null;
            Vue.prototype.$globalData.filename = temp;
        },

        onInput: function(evt) {

            let value = evt.target.value;
            if(shouldBeSavedAsNumber(value)) {
                value = Number(value);
            }

            Vue.prototype.$TCT.states[this.pk].fields[evt.target.name] = value;
        },
    },

    computed: {

        stateName: function() {
            return Vue.prototype.$TCT.states[this.pk].fields.name;
        },

        abbr: function() {
            return Vue.prototype.$TCT.states[this.pk].fields.abbr;
        },

        electoralVotes: function () {
            return Vue.prototype.$TCT.states[this.pk].fields.electoral_votes;
        },
  
        popularVotes: function () {
            return Vue.prototype.$TCT.states[this.pk].fields.popular_votes;
        },

        pollClosingTime: function () {
            return Vue.prototype.$TCT.states[this.pk].fields.poll_closing_time;
        },
  
        winnerTakeAll: function () {
            return Vue.prototype.$TCT.states[this.pk].fields.winner_take_all_flg;
        },

        election: function () {
            return Vue.prototype.$TCT.states[this.pk].fields.election;
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
        
        <label for="state_multiplier">Candidate PK {{candidate}} <span v-if="nickname" class="italic text-gray-400">({{this.nickname}})</span> {{stateName}} State Multiplier:</label><br>
        <input @input="onInput($event)" :value="stateMultiplier" name="state_multiplier" type="number"><br>
    </li>
    `,

    methods: {
        onInput: function(evt) {

            let value = evt.target.value;
            if(shouldBeSavedAsNumber(value)) {
                value = Number(value);
            }

            Vue.prototype.$TCT.candidate_state_multiplier[this.pk].fields[evt.target.name] = value;
        }
    },

    computed: {
        stateMultiplier: function () {
          return Vue.prototype.$TCT.candidate_state_multiplier[this.pk].fields.state_multiplier;
        },

        candidate : function () {
            return Vue.prototype.$TCT.candidate_state_multiplier[this.pk].fields.candidate;
        },

        nickname: function() {
            Vue.prototype.$globalData.filename;
            return Vue.prototype.$TCT.getNicknameForCandidate(this.candidate);
        },

        stateName : function () {
            const statePk = Vue.prototype.$TCT.candidate_state_multiplier[this.pk].fields.state;
            return Object.values(Vue.prototype.$TCT.states).filter(x => x.pk == statePk)[0].fields.name;
        }
    }
})

Vue.component('state-issue-score', {

    props: ['pk', 'hideIssuePK'],

    template: `
    <li class="mx-auto bg-gray-100 p-4">
        <h1 class="font-bold">STATE ISSUE SCORE PK {{this.pk}} <span v-if="hideIssuePK">({{this.stateName}})</span></h1><br>
        
        <div v-if="!hideIssuePK">
        <label for="issue">Issue PK</label><br>
        <select @change="onInput($event)" name="issue">
            <option v-for="issue in issues" :selected="issue.pk == currentIssue" :value="issue.pk" :key="issue.pk">{{issue.pk}} - {{issue.fields.name}}</option>
        </select><br>
        </div>
    
        <label for="state_issue_score">State Issue Score</label><br>
        <input @input="onInput($event)" :value="stateIssueScore" name="state_issue_score" type="number"><br>
    
        <label for="weight">Issue Weight</label><br>
        <input @input="onInput($event)" :value="weight" name="weight" type="number"><br>
    
    </li>
    `,

    methods: {
        onInput: function(evt) {

            let value = evt.target.value;
            if(shouldBeSavedAsNumber(value)) {
                value = Number(value);
            }

            Vue.prototype.$TCT.state_issue_scores[this.pk].fields[evt.target.name] = value;
        },
    },

    computed: {

        issues: function () {
            let a = [Vue.prototype.$globalData.filename];
            return Object.values(Vue.prototype.$TCT.issues);
        },

        currentIssue: function () {
            return Vue.prototype.$TCT.state_issue_scores[this.pk].fields.issue;
        },

        stateName: function() {
            const statePK = Vue.prototype.$TCT.state_issue_scores[this.pk].fields.state;
            return Vue.prototype.$TCT.states[statePK].fields.name;
        },

        stateIssueScore : function () {
            return Vue.prototype.$TCT.state_issue_scores[this.pk].fields.state_issue_score;
        },

        weight : function () {
            return Vue.prototype.$TCT.state_issue_scores[this.pk].fields.weight;
        }
    }
})

Vue.component('issue', {

    props: ['pk'],

    template: `
    <div class="mx-auto bg-gray-100 p-4">

        <h1 class="font-bold">ISSUE PK {{this.pk}}</h1><br>

        <label for="name">Issue Name</label><br>
        <input @input="onInputUpdatePicker($event)" :value="name" name="name" type="text"><br><br>

        <h1>Stances</h1><br>
        <stance v-for="n in 7" :key="n" :pk="pk" :n="n"></stance>

        <details open>
        <summary>Candidate Issue Scores ({{this.candidateIssueScores.length}})</summary>
        <ul>
            <candidate-issue-score isRunning="false" v-for="c in candidateIssueScores" :pk="c.pk" :key="c.pk"></candidate-issue-score>
        </ul>
        </details>

        <details open>
        <summary>Running Mate Issue Scores ({{this.runningMateIssueScores.length}})</summary>
        <ul>
            <candidate-issue-score isRunning="true" v-for="c in runningMateIssueScores" :pk="c.pk" :key="c.pk"></candidate-issue-score>
        </ul>
        </details>

        <details open>
        <summary>State Issue Scores For This Issue</summary>
        <ul>
            <state-issue-score :hideIssuePK = "true" v-for="c in stateIssueScores" :pk="c.pk" :key="c.pk"></state-issue-score>
        </ul>
        </details>

    </div>
    `,

    methods: {

        onInput: function(evt) {

            let value = evt.target.value;
            if(shouldBeSavedAsNumber(value)) {
                value = Number(value);
            }

            Vue.prototype.$TCT.issues[this.pk].fields[evt.target.name] = value;
        },

        onInputUpdatePicker: function(evt) {
            Vue.prototype.$TCT.issues[this.pk].fields[evt.target.name] = evt.target.value;
            const temp = Vue.prototype.$globalData.filename;
            Vue.prototype.$globalData.filename = "";
            Vue.prototype.$globalData.filename = temp;
        },

    },

    computed: {
        name: function () {
            return Vue.prototype.$TCT.issues[this.pk].fields.name;
        },

        candidateIssueScores: function() {
            return Vue.prototype.$TCT.getCandidateIssueScoreForIssue(this.pk);
        },

        runningMateIssueScores: function() {
            return Vue.prototype.$TCT.getRunningMateIssueScoreForIssue(this.pk);
            
        },

        stateIssueScores: function() {
            return Vue.prototype.$TCT.getStateIssueScoresForIssue(this.pk);
        }
    }
})

Vue.component('stance', {

    props: ['pk', 'n'],

    template: `
    <div class="mx-auto bg-gray-100 p-4">

        <label>Stance {{n}}</label><br>
        <input @input="onInput($event)" :value="stance" name="stance" type="text"></input><br>
    </div>
    `,

    methods: {

        onInput: function(evt) {
            Vue.prototype.$TCT.issues[this.pk].fields["stance_" + this.n] = evt.target.value;
        },

    },

    computed: {
        stance: function () {
          return Vue.prototype.$TCT.issues[this.pk].fields["stance_" + this.n];
        },
    }
})

Vue.component('candidate-issue-score', {

    props: ['pk', 'isRunning'],

    template: `
    <div class="mx-auto bg-gray-100 p-4">

        <label>Candidate PK <span v-if="nickname" class="italic text-gray-400">({{this.nickname}})</span></label><br>
        <input @input="onInput($event)" :value="candidate" name="candidate" type="number"></input><br>
    
        <label>Issue Score</label><br>
        <input @input="onInput($event)" :value="issueScore" name="issue_score" type="number"></input><br>
    
    </div>
    `,

    methods: {

        onInput: function(evt) {

            let value = evt.target.value;
            if(shouldBeSavedAsNumber(value)) {
                value = Number(value);
            }

            if(this.isRunning != "true")
            {
                Vue.prototype.$TCT.candidate_issue_score[this.pk].fields[evt.target.name] = value;
            }
            else
            {
                Vue.prototype.$TCT.running_mate_issue_score[this.pk].fields[evt.target.name] = value;
            }
        },

    },

    computed: {
        candidate: function () {
            if(this.isRunning != "true")
            {
                return Vue.prototype.$TCT.candidate_issue_score[this.pk].fields["candidate"];
            }
            else
            {
                return Vue.prototype.$TCT.running_mate_issue_score[this.pk].fields["candidate"];
            }
          
        },

        nickname: function() {
            return Vue.prototype.$TCT.getNicknameForCandidate(this.candidate);
        },

        issueScore: function () {
            if(this.isRunning != "true")
            {
                return Vue.prototype.$TCT.candidate_issue_score[this.pk].fields["issue_score"];
            }
            else
            {
                return Vue.prototype.$TCT.running_mate_issue_score[this.pk].fields["issue_score"];
            }
          
        },
    }
})

Vue.component('candidate', {

    props: ['pk'],

    template: `
    <div class="mx-auto bg-gray-100 p-4">

        <button class="bg-red-500 text-white p-2 my-2 rounded hover:bg-red-600" v-on:click="deleteCandidate()">Delete Candidate</button><br>

        <h1 class="font-bold">Candidate PK {{this.pk}} <span v-if="nickname" class="italic text-gray-400">({{this.nickname}})</span></h1><br>

        <br>
        <p>A nickname will display next to a candidate's pk so you know who they are more easily!</p>
        <label for="nickname">Nickname:</label><br>
        <input @input="onInputNickname($event)" :value="nickname" name="nickname" type="text"><br><br>

        <details open>
        <summary>Candidate State Multipliers ({{this.stateMultipliersForCandidate.length}})</summary>
        <ul>
            <candidate-state-multiplier v-for="c in stateMultipliersForCandidate" :pk="c.pk" :key="c.pk"></candidate-state-multiplier>
        </ul>
        </details>

    </div>
    `,

    methods: {

        onInput: function(evt, pk) {

            let value = evt.target.value;
            if(shouldBeSavedAsNumber(value)) {
                value = Number(value);
            }

            Vue.prototype.$TCT.candidate_state_multiplier[pk].fields[evt.target.name] = value;
        },

        onInputNickname: function(evt) {

            if(Vue.prototype.$TCT.jet_data.nicknames == null) {
                Vue.prototype.$TCT.jet_data.nicknames = {}
            }

            Vue.prototype.$TCT.jet_data.nicknames[this.pk] = evt.target.value;

            const temp = Vue.prototype.$globalData.filename;
            Vue.prototype.$globalData.filename = "";
            Vue.prototype.$globalData.filename = temp;
        },

        deleteCandidate: function() {
            Vue.prototype.$TCT.deleteCandidate(this.pk);
            Vue.prototype.$globalData.candidate = Vue.prototype.$TCT.getAllCandidatePKs()[0];

            const temp = Vue.prototype.$globalData.filename;
            Vue.prototype.$globalData.filename = "";
            Vue.prototype.$globalData.filename = temp;
        }

    },

    computed: {

        nickname: function() {
            Vue.prototype.$globalData.filename;
            return Vue.prototype.$TCT.getNicknameForCandidate(this.pk);
        },

        stateMultipliersForCandidate: function () {
            return Vue.prototype.$TCT.getStateMultiplierForCandidate(this.pk);
        },
    }
})