Vue.component('bulk', {

    data() {
        return {
            answerPk : "",
            candidate: "",
            affectedCandidate: ""
        };
    },

    template: `
    <div class="mx-auto bg-gray-100 p-4">

    <details open>
    <summary class="font-bold">Bulk State Answer Score Utility</summary>

        <label for="name">Answer PK:</label><br>
        <input v-model="answerPk" name="name" type="number"><br><br>

        <label for="name">Candidate PK:</label><br>
        <input v-model="candidate" name="name" type="number"><br><br>

        <label for="name">Affected Candidate PK:</label><br>
        <input v-model="affectedCandidate" name="name" type="number"><br><br>

        <ul>
            <bulk-state v-for="state in states" :pk="state.pk" :key="state.pk" :stateObject="state"></bulk-state>
        </ul>

        <button class="bg-green-500 text-white p-2 my-2 rounded hover:bg-green-600" v-on:click="generate()">Generate State Scores</button>

    </details>
    </div>
    `,

    methods: {
        onInput: function(evt) {

            let value = evt.target.value;
            if(shouldBeSavedAsNumber(value)) {
                value = Number(value);
            }

            Vue.prototype.$TCT.states[this.pk].fields[evt.target.name] = value;
        },

        generate: function() {
            const stateScores = document.getElementsByClassName("bulkStateScore");
            for(let i = 0; i < stateScores.length; i++) {
                const score = stateScores[i];
                const data = score.__vue__._data;

                const pk = Number(score.__vue__._props.pk);
                const amount = Number(data.amount);
                const include = data.include;

                if(include) {
                    const newPk =  Vue.prototype.$TCT.getNewPk();
                    let x = {
                        "model": "campaign_trail.answer_score_state",
                        "pk": newPk,
                        "fields": {
                            "answer": Number(this.answerPk),
                            "state": pk,
                            "candidate": this.candidate,
                            "affected_candidate": this.affectedCandidate,
                            "state_multiplier": amount
                        }
                    }
                    Vue.prototype.$TCT.answer_score_state[newPk] = x;
                }
                        
            }

            alert("Bulk generated state scores for answer with PK " + this.answerPk + " (do not submit again)");
        }
    },

    computed: {

        states: function () {
            return Object.values(Vue.prototype.$TCT.states);
        }
    }
});

Vue.component('bulk-state', {

    data() {
        return {
            include : false,
            amount : 0,
        };
    },

    props: ['pk', 'stateObject'],

    template: `
    <li class="bulkStateScore">
    <input type="checkbox" v-model="include">
    {{stateObject.fields.name}}
    <input v-model="amount" name="name" type="number"><br><br>
    </li>
    `,

    methods: {
        onInput: function(evt) {

            let value = evt.target.value;
            if(shouldBeSavedAsNumber(value)) {
                value = Number(value);
            }

            Vue.prototype.$TCT.states[this.pk].fields[evt.target.name] = value;
        },
    },

    computed: {

    }
});