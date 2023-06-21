const TEMPLATE_NAMES =
[
    "1844-Clay.txt",
    "1844-Polk.txt",
    "1860-Douglas.txt",
    "1860-Lincoln.txt",
    "1896-Bryan.txt",
    "1896-McKinley.txt",
    "1916-Hughes.txt",
    "1916-Wilson.txt",
    "1948-Dewey.txt",
    "1948-Truman.txt",
    "1960-Kennedy.txt",
    "1960-Nixon.txt",
    "1968-Humphrey.txt",
    "1968-Nixon.txt",
    "1968-Wallace.txt",
    "1976-Carter.txt",
    "1976-Ford.txt",
    "1988-Bush.txt",
    "1988-Dukakis.txt",
    "2000-Bush.txt",
    "2000-Gore.txt",
    "2000-Nader.txt",
    "2012-Obama.txt",
    "2012-Romney.txt",
    "2016-Clinton.txt",
    "2016-Trump.txt",
    "2020-Biden.txt",
    "2020-Trump.txt"
]

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

        this.cleanAllData();
    }

    cleanAllData() {
        this.cleanMap(this.questions);
        this.clean(this.answers);
        this.clean(this.issues);
        this.clean(this.state_issue_scores);
        this.clean(this.candidate_issue_score);
        this.clean(this.running_mate_issue_score);
        this.clean(this.candidate_state_multiplier);
        this.clean(this.answer_score_global);
        this.clean(this.answer_score_issue);
        this.clean(this.answer_score_state);
        this.clean(this.answer_feedback);
        this.clean(this.states);
    }

    cleanMap(map) {
        for (let [key, value] of map) {
            if(typeof value === 'object') {
                this.clean(map.get(key))
            }
        } 
    }

    clean(obj) {
        for (let key in obj) {
            if(!isNaN(obj[key])) {
                obj[key] = Number(obj[key]);
            }
            else if(typeof obj[key] === 'object') {
                this.clean(obj[key])
            }
        }
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

    getAllCyoaEvents() {
        if(this.jet_data.cyoa_enabled == null) {
            this.jet_data.cyoa_enabled = false;
        }

        if(this.jet_data.cyoa_data == null) {
            this.jet_data.cyoa_data = {};
        }

        return Object.values(this.jet_data.cyoa_data);
    }

    getAllEndings() {
        if(this.jet_data.endings_enabled == null) {
            this.jet_data.endings_enabled = false;
        }

        if(this.jet_data.ending_data == null) {
            this.jet_data.ending_data = {};
        }

        return Object.values(this.jet_data.ending_data);
    }

    exportCode2() {

        let f = "";

        f += this.getCYOACode();

        f += ("campaignTrail_temp.questions_json = ")
        let x = JSON.stringify(Array.from(this.questions.values()), null, 4).replaceAll("â€™", "\'")
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

        const code = this.jet_data.code_to_add;
        delete this.jet_data.code_to_add;

        f += ("campaignTrail_temp.jet_data = [")
        x = JSON.stringify(this.jet_data, null, 4)
        
        f += (x)
        f += "\n]"
        f += ("\n\n")

        if(this.jet_data.banner_enabled) {
            f += `campaignTrail_temp.candidate_image_url = "${this.jet_data.banner_data.canImage}"\n`;
            f += `campaignTrail_temp.running_mate_image_url = "${this.jet_data.banner_data.runImage}"\n`;
            f += `campaignTrail_temp.candidate_last_name = "${this.jet_data.banner_data.canName}"\n`;
            f += `campaignTrail_temp.running_mate_last_name = "${this.jet_data.banner_data.runName}"\n\n`;
        }

        f += this.getEndingCode();

        if(code) {
            f += "//#startcode";
            f += code;
            f += "//#endcode"
        }
        
        return f
    }

    getEndingCode() {
        if(this.jet_data.ending_data == null || !this.jet_data.endings_enabled) {
            return "";
        }

        var f = "campaignTrail_temp.multiple_endings = true;\nendingPicker = (out, totv, aa, quickstats) => {\n";

        const endings = this.getAllEndings();

        f += 
`
    function setImage(url) {
        if(url == '' || url == null) return;
        let interval = setInterval(function () {
            img = document.getElementsByClassName("person_image")[0];
            if (img != null) {
                img.src = url;
                clearInterval(interval);
            }
        }, 50);
    }
`

        for(let i = 0; i < endings.length; i++) {
            const ending = endings[i];

            f += 
`
    if(quickstats[${ending.variable}] ${ending.operator} ${ending.amount}) {
        setImage("${ending.endingImage}");
        return \`${ending.endingDescription}\`;
    }`;
        }

        f += "\n}\n";

        return f;
    }

    getCYOACode() {
        var f = "";
        if(this.jet_data.cyoa_data != null && this.jet_data.cyoa_enabled) {
            f += `
campaignTrail_temp.cyoa = true;

function getQuestionNumberFromPk(pk) {
    return campaignTrail_temp.questions_json.map(q=>q.pk).indexOf(pk)-1;
}

cyoAdventure = function (a) {
    ans = campaignTrail_temp.player_answers[campaignTrail_temp.player_answers.length-1];\n`

            let events = Object.values(this.jet_data.cyoa_data);

            for (let i = 0; i < events.length; i++) {
                f += `
    ${i > 0 ? "else " : ""}if (ans == ${events[i].answer}) {
        campaignTrail_temp.question_number = getQuestionNumberFromPk(${events[i].question});
    }`
            }

            if(events.length > 0) {
                f += 
    `\n    else {
        return false;
    }`
            }

            f += "\n}\n\n"
        }
        return f;
    }
}

function extractJSON(raw_file, start, end, backup = null, backupEnd = null, required = true, fallback = []) {
    let f = raw_file
    if(!f.includes(start)) {
        if(backup != null) {
            console.log(`Start [${start}] not in file provided, trying backup ${backup}`)
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
        raw = raw.substring(0, raw.length-1)
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

    console.log(`found ${start}!`)

    return res
}

function extractCode(raw_json) {
    let code = raw_json.split("//#startcode")[1]?.split("//#endcode")[0];
    return code;
}

function loadDataFromFile(raw_json) {

    let highest_pk = -1

    let questions = new Map();
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

    const code = extractCode(raw_json);

    var duplicates = false;

    raw_json = raw_json.replaceAll("\n", "");
    raw_json = raw_json.replaceAll("\r", "")
    raw_json = raw_json.replaceAll(/ +/g, " ");

    states_json = extractJSON(raw_json, "campaignTrail_temp.states_json = JSON.parse(", ");", "campaignTrail_temp.states_json = [", "]")
    states_json.forEach(state => {

        if(state["pk"] in states) {
            console.log(`WARNING: Found duplicate pk ${state["pk"]} in states already, make sure there are no duplicate PKs in your file before importing`)
            duplicates = true;
        }

        highest_pk = Math.max(highest_pk, state["pk"])
        states[state["pk"]] = state
    });
       
    questions_json = extractJSON(raw_json, "campaignTrail_temp.questions_json = JSON.parse(", ");", "campaignTrail_temp.questions_json = [", "]");
    questions_json.forEach(question => {

        if(question["pk"] in questions) {
            console.log(`WARNING: Found duplicate pk ${question["pk"]} in questions already, make sure there are no duplicate PKs in your file before importing`)
            duplicates = true;
        }

        highest_pk = Math.max(highest_pk, question["pk"]);
        question['fields']['description'] = question['fields']['description'].replaceAll("â€™", "'").replaceAll("â€”", "—");
        questions.set(question.pk, question);
    });

    answers_json = extractJSON(raw_json, "campaignTrail_temp.answers_json = JSON.parse(", ");", "campaignTrail_temp.answers_json = [", "]");
    answers_json.forEach(answer => {

        if(answer["pk"] in answers) {
            console.log(`WARNING: Found duplicate pk ${answer["pk"]} in answers already, make sure there are no duplicate PKs in your file before importing`)
            duplicates = true;
        }

        highest_pk = Math.max(highest_pk, answer["pk"]);
        answer['fields']['description'] = answer['fields']['description'].replaceAll("â€™", "'").replaceAll("â€”", "—");
        key = answer["pk"];
        answers[key] = answer;
    });

    answer_feedbacks_json = extractJSON(raw_json, "campaignTrail_temp.answer_feedback_json = JSON.parse(", ");", "campaignTrail_temp.answer_feedback_json = [", "]");
    answer_feedbacks_json.forEach(feedback => {

        if(feedback["pk"] in feedbacks) {
            console.log(`WARNING: Found duplicate pk ${feedback["pk"]} in feedbacks already, make sure there are no duplicate PKs in your file before importing`)
            duplicates = true;
        }

        highest_pk = Math.max(highest_pk, feedback["pk"]);
        feedback['fields']['answer_feedback'] = feedback['fields']['answer_feedback'].replaceAll("â€™", "'").replaceAll("â€”", "—");
        key = feedback['pk'];
        feedbacks[key] = feedback;
    });

    answer_score_globals_json = extractJSON(raw_json, "campaignTrail_temp.answer_score_global_json = JSON.parse(", ");", "campaignTrail_temp.answer_score_global_json = [", "]");
    answer_score_globals_json.forEach(x => {

        if(x["pk"] in answer_score_globals) {
            console.log(`WARNING: Found duplicate pk ${x["pk"]} in answer_score_globals already, make sure there are no duplicate PKs in your file before importing`)
            duplicates = true;
        }


        highest_pk = Math.max(highest_pk, x["pk"]);
        key = x['pk'];
        answer_score_globals[key] = x;
    });

    answer_score_issues_json = extractJSON(raw_json, "campaignTrail_temp.answer_score_issue_json = JSON.parse(", ");", "campaignTrail_temp.answer_score_issue_json = [", "]");
    answer_score_issues_json.forEach(x => {

        if(x["pk"] in answer_score_issues) {
            console.log(`WARNING: Found duplicate pk ${x["pk"]} in answer_score_issues already, make sure there are no duplicate PKs in your file before importing`)
            duplicates = true;
        }

        highest_pk = Math.max(highest_pk, x["pk"]);
        key = x['pk'];
        answer_score_issues[key] = x;
    });

    answer_score_states_json = extractJSON(raw_json, "campaignTrail_temp.answer_score_state_json = JSON.parse(", ");", "campaignTrail_temp.answer_score_state_json = [", "]");
    answer_score_states_json.forEach(x => {

        if(x["pk"] in answer_score_states) {
            console.log(`WARNING: Found duplicate pk ${x["pk"]} in answer_score_states already, make sure there are no duplicate PKs in your file before importing`)
            duplicates = true;
        }

        highest_pk = Math.max(highest_pk, x["pk"]);
        key = x['pk'];
        answer_score_states[key] = x;
    });

    candidate_issue_scores_json = extractJSON(raw_json, "campaignTrail_temp.candidate_issue_score_json = JSON.parse(", ");", "campaignTrail_temp.candidate_issue_score_json = [", "]");
    candidate_issue_scores_json.forEach(x => {

        if(x["pk"] in candidate_issue_scores) {
            console.log(`WARNING: Found duplicate pk ${x["pk"]} in candidate_issue_scores already, make sure there are no duplicate PKs in your file before importing`)
            duplicates = true;
        }

        highest_pk = Math.max(highest_pk, x["pk"]);
        key = x['pk'];
        candidate_issue_scores[key] = x;
    });

    candidate_state_multipliers_json = extractJSON(raw_json, "campaignTrail_temp.candidate_state_multiplier_json = JSON.parse(", ");", "campaignTrail_temp.candidate_state_multiplier_json = [", "]");
    candidate_state_multipliers_json.forEach(x => {

        if(x["pk"] in candidate_state_multipliers) {
            console.log(`WARNING: Found duplicate pk ${x["pk"]} in candidate_state_multipliers already, make sure there are no duplicate PKs in your file before importing`)
            duplicates = true;
        }

        highest_pk = Math.max(highest_pk, x["pk"]);
        key = x['pk'];
        candidate_state_multipliers[key] = x;
    });

    running_mate_issue_scores_json = extractJSON(raw_json, "campaignTrail_temp.running_mate_issue_score_json = JSON.parse(", ");", "campaignTrail_temp.running_mate_issue_score_json = [", "]");
    running_mate_issue_scores_json.forEach(x => {

        if(x["pk"] in running_mate_issue_scores) {
            console.log(`WARNING: Found duplicate pk ${x["pk"]} in running_mate_issue_scores already, make sure there are no duplicate PKs in your file before importing`)
            duplicates = true;
        }

        highest_pk = Math.max(highest_pk, x["pk"]);
        key = x['pk'];
        running_mate_issue_scores[key] = x;
    });

    state_issue_scores_json = extractJSON(raw_json, "campaignTrail_temp.state_issue_score_json = JSON.parse(", ");", "campaignTrail_temp.state_issue_score_json = [", "]");
    state_issue_scores_json.forEach(x => {

        if(x["pk"] in state_issue_scores) {
            console.log(`WARNING: Found duplicate pk ${x["pk"]} in state_issue_scores already, make sure there are no duplicate PKs in your file before importing`)
            duplicates = true;
        }

        highest_pk = Math.max(highest_pk, x["pk"]);
        key = x['pk'];
        state_issue_scores[key] = x;
    });

    issues_json = extractJSON(raw_json, "campaignTrail_temp.issues_json = JSON.parse(", ");", "campaignTrail_temp.issues_json = [", "]");
    issues_json.forEach(x => {

        if(x["pk"] in issues) {
            console.log(`WARNING: Found duplicate pk ${x["pk"]} in issues already, make sure there are no duplicate PKs in your file before importing`)
            duplicates = true;
        }

        highest_pk = Math.max(highest_pk, x["pk"]);
        key = x['pk'];
        issues[key] = x;
    });

    if(duplicates) alert("WARNING: Duplicate PKs found during import process, see console for more details. Some features may not work as expected or data may be missing.")

    jet_data = extractJSON(raw_json, "campaignTrail_temp.jet_data = [", "]", null, null, false, [{}])[0];

    jet_data.code_to_add = code;

    data = new TCTData(questions, answers, issues, state_issue_scores, candidate_issue_scores, running_mate_issue_scores, candidate_state_multipliers, answer_score_globals, answer_score_issues, answer_score_states, feedbacks, states, highest_pk, jet_data)

    return data
}