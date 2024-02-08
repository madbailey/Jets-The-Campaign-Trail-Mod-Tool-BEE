const DEBUG = false;

let global_parameter = [
    {
        "model": "campaign_trail.global_parameter",
        "pk": 1,
        "fields": {
            "vote_variable": 1.125,
            "max_swing": 0.12,
            "start_point": 0.94,
            "candidate_issue_weight": 10,
            "running_mate_issue_weight": 3,
            "issue_stance_1_max": -0.71,
            "issue_stance_2_max": -0.3,
            "issue_stance_3_max": -0.125,
            "issue_stance_4_max": 0.125,
            "issue_stance_5_max": 0.3,
            "issue_stance_6_max": 0.71,
            "global_variance": 0.01,
            "state_variance": 0.005,
            "question_count": 25,
            "default_map_color_hex": "#C9C9C9",
            "no_state_map_color_hex": "#999999"
        }
    }
]

const VARIANCE = global_parameter[0].fields.global_variance;

function getCurrentVoteResults(e) {
    let t = 1;
    const i = e.getAllCandidatePKs();
    let r;
    e.player_visits = [];
    global_parameter[0].fields.question_count = e.questions.size;

    let running_mate_issue_score = Object.values(e.running_mate_issue_score);
    let state_issue_score = Object.values(e.state_issue_scores);
    let states = Object.values(e.states);


    const s = i.map((candidate) => {
      e.player_answers = [];
      const n = e.player_answers.reduce((acc, answer) => {
        const score = e.answer_score_global.find(
          (item) =>
            item.fields.answer === answer &&
            item.fields.candidate === e.candidate_id &&
            item.fields.affected_candidate === candidate
        );
        if (score) {
          acc.push(score.fields.global_multiplier);
        }
        return acc;
      }, []);

      const l = n.reduce((acc, score) => acc + score, 0);
      const o =
        candidate === e.candidate_id && l < -0.4
          ? 0.6
          : 1 + l;
      const c =
        candidate === e.candidate_id
          ? o * (1 + F(candidate) * VARIANCE) * e.difficulty_level_multiplier
          : o * (1 + F(candidate) * VARIANCE);
      const _ = isNaN(c) ? 1 : c;

      return {
        candidate,
        global_multiplier: _,
      };
    });


    const u = i.map((candidate) => {
        const v = Object.values(e.candidate_issue_score)
          .filter((item) => item.fields.candidate === candidate)
          .map((item) => ({
            issue: item.fields.issue,
            issue_score: item.fields.issue_score,
          }));

        return {
          candidate_id: candidate,
          issue_scores: removeIssueDuplicates(v),
        };
      });

    var f = [];
    let candidate_state_multiplier = Object.values(e.candidate_state_multiplier);
    for (a = 0; a < i.length; a++) {
        var m = [];
        for (r = 0; r < candidate_state_multiplier.length; r++)
            if (candidate_state_multiplier[r].fields.candidate == i[a]) {
                var p = candidate_state_multiplier[r].fields.state_multiplier * s[a].global_multiplier * (1 + F(candidate_state_multiplier[r].fields.candidate) * VARIANCE);
                if (m.push({
                        state: candidate_state_multiplier[r].fields.state,
                        state_multiplier: p
                    }), m.length == states.length) break;
                P(m, "state")
            }
        f.push({
            candidate_id: i[a],
            state_multipliers: m
        })
    }

    for (a = 0; a < u[0].issue_scores.length; a++) {
        var h = -1;
        for (r = 0; r < running_mate_issue_score.length; r++)
            if (running_mate_issue_score[r].fields.issue == u[0].issue_scores[a].issue) {
                h = r;
                break
            }
        var g = 0,
            b = 0;
        for (r = 0; r < e.player_answers.length; r++)
            for (d = 0; d < e.answer_score_issue.length; d++) e.answer_score_issue[d].fields.issue == u[0].issue_scores[a].issue && e.answer_score_issue[d].fields.answer == e.player_answers[r] && (g += e.answer_score_issue[d].fields.issue_score * e.answer_score_issue[d].fields.issue_importance, b += e.answer_score_issue[d].fields.issue_importance);
        u[0].issue_scores[a].issue_score = (u[0].issue_scores[a].issue_score * global_parameter[0].fields.candidate_issue_weight + running_mate_issue_score[h].fields.issue_score * global_parameter[0].fields.running_mate_issue_weight + g) / (global_parameter[0].fields.candidate_issue_weight + global_parameter[0].fields.running_mate_issue_weight + b)
    }
    for (a = 0; a < i.length; a++)
        for (r = 0; r < f[a].state_multipliers.length; r++) {
            var w = 0;
            for (d = 0; d < e.player_answers.length; d++)
                for (var j = 0; j < e.answer_score_state.length; j++) e.answer_score_state[j].fields.state == f[a].state_multipliers[r].state && e.answer_score_state[j].fields.answer == e.player_answers[d] && e.answer_score_state[j].fields.candidate == e.candidate_id && e.answer_score_state[j].fields.affected_candidate == i[a] && (w += e.answer_score_state[j].fields.state_multiplier);
            if (0 == a) {
                e.running_mate_state_id == f[a].state_multipliers[r].state && (w += .004 * f[a].state_multipliers[r].state_multiplier);
                for (d = 0; d < e.player_visits.length; d++) e.player_visits[d] == f[a].state_multipliers[r].state && (w += .005 * Math.max(.1, f[a].state_multipliers[r].state_multiplier) * (e.shining_data.visit_multiplier ?? 1))
            }
            f[a].state_multipliers[r].state_multiplier += w
        }
    var y = [];
    for (a = 0; a < f[0].state_multipliers.length; a++) {
        var k = [];
        for (r = 0; r < i.length; r++) {
            var $ = 0;
            for (d = 0; d < u[r].issue_scores.length; d++) {
                var T = 0,
                    A = 1;
                for (j = 0; j < state_issue_score.length; j++) {
                    if (state_issue_score[j].fields.state == f[0].state_multipliers[a].state && state_issue_score[j].fields.issue == u[0].issue_scores[d].issue) {
                        T = state_issue_score[j].fields.state_issue_score, A = state_issue_score[j].fields.weight;
                        break
                    }
                }
                var S = u[r].issue_scores[d].issue_score * Math.abs(u[r].issue_scores[d].issue_score),
                    E = T * Math.abs(T);
                $ += global_parameter[0].fields.vote_variable - Math.abs((S - E) * A)
            }
            for (d = 0; d < f[r].state_multipliers.length; d++)
                if (f[r].state_multipliers[d].state == f[0].state_multipliers[a].state) var C = d;

            if(DEBUG) {
                console.log(`From key ${r} into f, trying to get state multiplier index ${C}`);
                console.log(f[r].state_multipliers[C]);
            }

            $ *= f[r].state_multipliers[C].state_multiplier, $ = Math.max($, 0), k.push({
                candidate: i[r],
                result: $
            })
        }
        y.push({
            state: f[0].state_multipliers[a].state,
            result: k
        })
    }

    for (a = 0; a < y.length; a++)
        for (r = 0; r < states.length; r++)
            if (y[a].state == states[r].pk) {
                y[a].abbr = states[r].fields.abbr;
                break
            }
    for (a = 0; a < y.length; a++) {
        var M = 0;
        for (r = 0; r < states.length; r++)
            if (states[r].pk == y[a].state) {
                M = Math.floor(states[r].fields.popular_votes * (.95 + .1 * Math.random()));
                break
            }
        var x = 0;
        for (r = 0; r < y[a].result.length; r++) x += y[a].result[r].result;
        for (r = 0; r < y[a].result.length; r++) {
            var N = y[a].result[r].result / x;
            y[a].result[r].percent = N, y[a].result[r].votes = Math.floor(N * M)
        }
    }
    for (a = 0; a < y.length; a++) {
        var I = R(states, y[a].state),
            O = 0;
        if (P(y[a].result, "percent"), y[a].result.reverse(), O = states[I].fields.electoral_votes, ("1" == e.game_type_id || "3" == e.game_type_id))
            if (1 == states[I].fields.winner_take_all_flg)
                for (r = 0; r < y[a].result.length; r++) y[a].result[r].electoral_votes = 0 == r ? O : 0;
            else {
                O = states[I].fields.electoral_votes;
                var H = 0;
                for (r = 0; r < y[a].result.length; r++) H += y[a].result[r].votes;
                var L = Math.ceil(y[a].result[0].votes / H * O * 1.25),
                    D = O - L;
                for (r = 0; r < y[a].result.length; r++) y[a].result[r].electoral_votes = 0 == r ? L : 1 == r ? D : 0
            }
        if ("2" == e.game_type_id) {
            var V = [];
            for (r = 0; r < y[a].result.length; r++) V.push(y[a].result[r].percent);
            var q = divideElectoralVotesProp(V, O);
            for (r = 0; r < y[a].result.length; r++) y[a].result[r].electoral_votes = q[r]
        }
    }

    if (e.primary_states) {
        const primaryStates = JSON.parse(e.primary_states);
        // Create a new copy of the primary states array using Array.slice()
        const primM = primaryStates.slice().map(f => f.state);

        // Update the y array using the new copy of the primary states array
        for (let i = 0; i < y.length; i++) {
            if (primM.includes(y[i].state)) {
                const indexOfed = primM.findIndex(state => state === y[i].state);
                y[i].result = primaryStates[indexOfed].result;
            }
        }

    }

    if (1 == t) return y;
    if (2 == t) {
        for (a = 0; a < y.length; a++) {
            for (r = 0; r < y[a].result.length; r++) {
                var G = 1 + F(y[a].result[r].candidate) * global_parameter[0].fields.global_variance;
                y[a].result[r].result *= G
            }
            for (M = 0, r = 0; r < states.length; r++)
                if (states[r].pk == y[a].state) {
                    M = Math.floor(states[r].fields.popular_votes * (.95 + .1 * Math.random()));
                    break
                }
            for (x = 0, r = 0; r < y[a].result.length; r++) x += y[a].result[r].result;
            for (r = 0; r < y[a].result.length; r++) {
                N = y[a].result[r].result / x;
                y[a].result[r].percent = N, y[a].result[r].votes = Math.floor(N * M)
            }
        }

        return y
    }
}

function R(states, pk) {
    for (var i = -1, a = 0; a < states.length; a++)
        if (states[a].pk == pk) {
            i = a;
            break
        }
    return i
}

function F() {
    var e, t, i;
    do {
        i = (e = 2 * Math.random() - 1) * e + (t = 2 * Math.random() - 1) * t
    } while (i >= 1 || 0 == i);
    return e * Math.sqrt(-2 * Math.log(i) / i)
}

function P(e, t) {
    return e.sort(function(e, i) {
        var a = e[t],
            s = i[t];
        return a < s ? -1 : a > s ? 1 : 0
    })
}

function removeIssueDuplicates(array) {
    const a = array.filter((item, index) => array.map(f=>f.issue).indexOf(item.issue) == index);
    return a
}