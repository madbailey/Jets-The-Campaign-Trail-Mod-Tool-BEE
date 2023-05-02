class TCTData {
    constructor(questions, answers, issues, state_issue_scores, candidate_issue_score, running_mate_issue_score, candidate_state_multiplier, answer_score_global, answer_score_issue, answer_score_state, answer_feedback, states, highest_pk, jet_data) {
        this.highest_pk = highest_pk
        this.questions = questions
        this.answers = answers
        this.issues = issues
        this.state_issue_scores = state_issue_scores
        this.candidate_issue_score = candidate_issue_score
        this.running_mate_issue_score = running_mate_issue_score
        this.candidate_state_multiplier = candidate_state_multiplier
        this.answer_score_global = answer_score_global
        this.answer_score_issue = answer_score_issue
        this.answer_score_state = answer_score_state
        this.answer_feedback = answer_feedback
        this.states = states
        this.jet_data = jet_data
    }

    getNewPk() {
        const pk = this.highest_pk + 1
        this.highest_pk = pk
        return pk
    }
        
    getAnswersForQuestion(pk) {
        return Object.values(this.answers).filter(answer => answer.fields.question == pk);
    }
    
    getAdvisorFeedbackForAnswer(pk) {
        return Object.values(this.answer_feedback).filter(feedback => feedback.fields.answer == pk);
    }
    
    getGlobalScoreForAnswer(pk) {
        return Object.values(this.answer_score_global).filter(x => x.fields.answer == pk);
    }
    
    getStateScoreForAnswer(pk) {
        return Object.values(this.answer_score_state).filter(x => x.fields.answer == pk);
    }
    
    getIssueScoreForAnswer(pk) {
        return Object.values(this.answer_score_issue).filter(x => x.fields.answer == pk);
    }
    
    getIssueScoreForState(pk) {
        return Object.values(this.state_issue_scores).filter(x => x.fields.state == pk);
    }
    
    getIssueScoreForCandidate(pk) {
        return Object.values(this.candidate_issue_score).filter(x => x.fields.candidate == pk);
    }
    
    getStateMultiplierForCandidate(pk) {
        return Object.values(this.candidate_state_multiplier).filter(x => x.fields.candidate == pk);
    }
    
    getCandidateIssueScoreForIssue(pk) {
        return Object.values(this.candidate_issue_score).filter(x => x.fields.issue == pk);
    }
    
    getRunningMateIssueScoreForIssue(pk) {
        return Object.values(this.running_mate_issue_score).filter(x => x.fields.issue == pk);
    }
    
    getRunningMateIssueScoreForCandidate(pk) {
        return Object.values(this.running_mate_issue_score).filter(x => x.fields.candidate == pk);
    }
    
    getCandidateStateMultipliersForState(pk) {
        return Object.values(this.candidate_state_multiplier).filter(x => x.fields.state == pk);
    }

    getNicknameForCandidate(pk) {
        if(this.jet_data == null || this.jet_data['nicknames'] == null) {
            return "";
        }

        return this.jet_data.nicknames[pk];
    }

    exportCode2() {
        let f = "";
        f += ("campaignTrail_temp.questions_json = ")
        let x = JSON.stringify(Object.values(this.questions), null, 4).replaceAll("â€™", "\'")
        f += (x)
        f += ("\n\n")

        f += ("campaignTrail_temp.answers_json = ")
        x = JSON.stringify(Object.values(this.answers), null, 4).replaceAll("â€™", "\'")
        f += (x)
        f += ("\n\n")

        f += ("campaignTrail_temp.states_json = ")
        x = JSON.stringify(Object.values(this.states), null, 4)
        f += (x)
        f += ("\n\n")

        f += ("campaignTrail_temp.issues_json = ")
        x = JSON.stringify(Object.values(this.issues), null, 4).replaceAll("â€™", "\'")
        f += (x)
        f += ("\n\n")

        f += ("campaignTrail_temp.state_issue_score_json = ")
        x = JSON.stringify(Object.values(this.state_issue_scores), null, 4)
        f += (x)
        f += ("\n\n")

        f += ("campaignTrail_temp.candidate_issue_score_json = ")
        x = JSON.stringify(Object.values(this.candidate_issue_score), null, 4)
        f += (x)
        f += ("\n\n")

        f += ("campaignTrail_temp.running_mate_issue_score_json = ")
        x = JSON.stringify(Object.values(this.running_mate_issue_score), null, 4)
        f += (x)
        f += ("\n\n")

        f += ("campaignTrail_temp.candidate_state_multiplier_json = ")
        x = JSON.stringify(Object.values(this.candidate_state_multiplier), null, 4)
        f += (x)
        f += ("\n\n")

        f += ("campaignTrail_temp.answer_score_global_json = ")
        x = JSON.stringify(Object.values(this.answer_score_global), null, 4)
        f += (x)
        f += ("\n\n")

        f += ("campaignTrail_temp.answer_score_issue_json = ")
        x = JSON.stringify(Object.values(this.answer_score_issue), null, 4)
        f += (x)
        f += ("\n\n")

        f += ("campaignTrail_temp.answer_score_state_json = ")
        x = JSON.stringify(Object.values(this.answer_score_state), null, 4)
        f += (x)
        f += ("\n\n")

        f += ("campaignTrail_temp.answer_feedback_json = ")
        x = JSON.stringify(Object.values(this.answer_feedback), null, 4)
        f += (x)
        f += ("\n\n")

        f += ("campaignTrail_temp.jet_data = [")
        x = JSON.stringify(this.jet_data, null, 4)
        
        f += (x)
        f += "\n]"
        f += ("\n\n")
        return f
    }
}

function extractJSON(raw_file, start, end, backup = null, backupEnd = null, required = true, fallback = []) {
    let f = raw_file
    if(!f.includes(start)) {
        if(backup != null) {
            return extractJSON(f, backup, backupEnd == null ? end : backupEnd, null, null, required)
        }

        console.log(`ERROR: Start [${start}] not in file provided, returning none`)
            
        if(required) {
            alert(`WARNING: Your uploaded code 2 is missing the section '${start}'. Skipping it, but the editor may be missing some features because the section is missing. Please check your base scenario.`)
        }
        
        return fallback
    }
    else if(start.includes("JSON.parse")) {
        f = f.replaceAll('\\"', '"')
        f = f.replaceAll("\\'", "'")
        f = f.replaceAll("\\\\", "\\")
    }

    let raw = f.trim().split(start)[1].split(end)[0].trim()

    if(raw[0] == '"' || raw[0] == "'") {
        raw = raw.substring(1)
    }
        

    if(raw.slice(-1) == '"' || raw.slice(-1) == "'") {
        raw = raw.substring(0, raw.length - 1)
    }
        
    try {
        if( end == "]")
            raw = "[" + raw + "]"
        res = JSON.parse(raw)
    }
    catch(e) {
        console.log(`Ran into error parsing JSON for start [${start}]. Copying to clipboard`)
        console.log(`"Error: ${e}`)
        navigator.clipboard.writeText(raw);
        return fallback
    }
    return res
}

function loadDataFromFile(raw_json) {

    let highest_pk = -1

    let questions = {}
    let answers = {}
    let states = {}
    let feedbacks = {}

    let answer_score_globals = {}
    let answer_score_issues = {}
    let answer_score_states = {}
    
    let state_issue_scores = {}

    let candidate_issue_scores = {}
    let candidate_state_multipliers = {}
    let running_mate_issue_scores = {}

    let issues = {}

    let jet_data = {}

    raw_json = raw_json.replaceAll("\n", "")
    raw_json = raw_json.replaceAll(/ +/g, " ");

    states_json = extractJSON(raw_json, "campaignTrail_temp.states_json = JSON.parse(", ");", "campaignTrail_temp.states_json = [", "]")
    states_json.forEach(state => {
        highest_pk = Math.max(highest_pk, state["pk"])
        states[state["pk"]] = state
    });
       
    questions_json = extractJSON(raw_json, "campaignTrail_temp.questions_json = JSON.parse(", ");", "campaignTrail_temp.questions_json = [", "]");
    questions_json.forEach(question => {
        highest_pk = Math.max(highest_pk, question["pk"]);
        question['fields']['description'] = question['fields']['description'].replaceAll("â€™", "'").replaceAll("â€”", "—");
        questions[question["pk"]] = question;
    });

    answers_json = extractJSON(raw_json, "campaignTrail_temp.answers_json = JSON.parse(", ");", "campaignTrail_temp.answers_json = [", "]");
    answers_json.forEach(answer => {
        highest_pk = Math.max(highest_pk, answer["pk"]);
        answer['fields']['description'] = answer['fields']['description'].replaceAll("â€™", "'").replaceAll("â€”", "—");
        key = answer["pk"];
        answers[key] = answer;
    });

    answer_feedbacks_json = extractJSON(raw_json, "campaignTrail_temp.answer_feedback_json = JSON.parse(", ");", "campaignTrail_temp.answer_feedback_json = [", "]");
    answer_feedbacks_json.forEach(feedback => {
        highest_pk = Math.max(highest_pk, feedback["pk"]);
        feedback['fields']['answer_feedback'] = feedback['fields']['answer_feedback'].replaceAll("â€™", "'").replaceAll("â€”", "—");
        key = feedback['pk'];
        feedbacks[key] = feedback;
    });

    answer_score_globals_json = extractJSON(raw_json, "campaignTrail_temp.answer_score_global_json = JSON.parse(", ");", "campaignTrail_temp.answer_score_global_json = [", "]");
    answer_score_globals_json.forEach(x => {
        highest_pk = Math.max(highest_pk, x["pk"]);
        key = x['pk'];
        answer_score_globals[key] = x;
    });

    answer_score_issues_json = extractJSON(raw_json, "campaignTrail_temp.answer_score_issue_json = JSON.parse(", ");", "campaignTrail_temp.answer_score_issue_json = [", "]");
    answer_score_issues_json.forEach(x => {
        highest_pk = Math.max(highest_pk, x["pk"]);
        key = x['pk'];
        answer_score_issues[key] = x;
    });

    answer_score_states_json = extractJSON(raw_json, "campaignTrail_temp.answer_score_state_json = JSON.parse(", ");", "campaignTrail_temp.answer_score_state_json = [", "]");
    answer_score_states_json.forEach(x => {
        highest_pk = Math.max(highest_pk, x["pk"]);
        key = x['pk'];
        answer_score_states[key] = x;
    });

    candidate_issue_scores_json = extractJSON(raw_json, "campaignTrail_temp.candidate_issue_score_json = JSON.parse(", ");", "campaignTrail_temp.candidate_issue_score_json = [", "]");
    candidate_issue_scores_json.forEach(x => {
        highest_pk = Math.max(highest_pk, x["pk"]);
        key = x['pk'];
        candidate_issue_scores[key] = x;
    });

    candidate_state_multipliers_json = extractJSON(raw_json, "campaignTrail_temp.candidate_state_multiplier_json = JSON.parse(", ");", "campaignTrail_temp.candidate_state_multiplier_json = [", "]");
    candidate_state_multipliers_json.forEach(x => {
        highest_pk = Math.max(highest_pk, x["pk"]);
        key = x['pk'];
        candidate_state_multipliers[key] = x;
    });

    running_mate_issue_scores_json = extractJSON(raw_json, "campaignTrail_temp.running_mate_issue_score_json = JSON.parse(", ");", "campaignTrail_temp.running_mate_issue_score_json = [", "]");
    running_mate_issue_scores_json.forEach(x => {
        highest_pk = Math.max(highest_pk, x["pk"]);
        key = x['pk'];
        running_mate_issue_scores[key] = x;
    });

    state_issue_scores_json = extractJSON(raw_json, "campaignTrail_temp.state_issue_score_json = JSON.parse(", ");", "campaignTrail_temp.state_issue_score_json = [", "]");
    state_issue_scores_json.forEach(x => {
        highest_pk = Math.max(highest_pk, x["pk"]);
        key = x['pk'];
        state_issue_scores[key] = x;
    });

    issues_json = extractJSON(raw_json, "campaignTrail_temp.issues_json = JSON.parse(", ");", "campaignTrail_temp.issues_json = [", "]");
    issues_json.forEach(x => {
        highest_pk = Math.max(highest_pk, x["pk"]);
        key = x['pk'];
        issues[key] = x;
    });

    jet_data = extractJSON(raw_json, "campaignTrail_temp.jet_data = [", "]", null, null, false, [{}])[0];

    data = new TCTData(questions, answers, issues, state_issue_scores, candidate_issue_scores, running_mate_issue_scores, candidate_state_multipliers, answer_score_globals, answer_score_issues, answer_score_states, feedbacks, states, highest_pk, jet_data)

    return data
}